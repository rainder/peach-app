/* eslint-disable max-lines */
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Animated, Dimensions, SafeAreaView, StatusBar, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import analytics from '@react-native-firebase/analytics'
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import RNRestart from 'react-native-restart'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Footer, Header } from './components'
import tw from './styles/tailwind'
import i18n from './utils/i18n'
import views from './views'

import AppContext, { getAppContext, setAppContext } from './contexts/app'
import BitcoinContext, { getBitcoinContext, setBitcoinContext } from './contexts/bitcoin'
import { DrawerContext, getDrawer, setDrawer } from './contexts/drawer'
import LanguageContext from './contexts/language'
import { getMessage, MessageContext, setMessage, showMessageEffect } from './contexts/message'
import { defaultOverlay, OverlayContext, useOverlay } from './contexts/overlay'
import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import Drawer from './components/Drawer'
import Message from './components/Message'
import Overlay from './components/Overlay'

import { DEV } from '@env'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { APPVERSION, ISEMULATOR, LATESTAPPVERSION, MINAPPVERSION, TIMETORESTART } from './constants'
import appStateEffect from './effects/appStateEffect'
import handleNotificationsEffect from './effects/handleNotificationsEffect'
import { initApp } from './init'
import { getPeachInfo, getTrades } from './init/session'
import websocket from './init/websocket'
import { showAnalyticsPrompt } from './overlays/showAnalyticsPrompt'
import { account, getAccount } from './utils/account'
import { getChatNotifications } from './utils/chat'
import { error, info } from './utils/log'
import { getRequiredActionCount } from './utils/offer'
import { marketPrices } from './utils/peachAPI/public/market'
import { compatibilityCheck, linkToAppStore } from './utils/system'
import { Background } from './components/background/Background'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

const queryClient = new QueryClient()

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showHeader = (view: keyof RootStackParamList) => !!views.find((v) => v.name === view)?.showHeader

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showFooter = (view: keyof RootStackParamList) => !!views.find((v) => v.name === view)?.showFooter

let goHomeTimeout: NodeJS.Timer

const usePartialAppSetup = () => {
  const [, updateBitcoinContext] = useContext(BitcoinContext)
  const [, updateAppContext] = useContext(AppContext)
  const [active, setActive] = useState(true)

  useEffect(
    appStateEffect({
      callback: (isActive) => {
        setActive(isActive)
        if (isActive) {
          getPeachInfo(getAccount())
          getTrades()
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
          analytics().logAppOpen()

          clearTimeout(goHomeTimeout)
        } else {
          goHomeTimeout = setTimeout(() => RNRestart.Restart(), TIMETORESTART)
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (!active) return () => {}

    const checkingInterval = 15 * 1000
    const checkingFunction = async () => {
      const [prices] = await marketPrices({ timeout: checkingInterval })
      if (prices) updateBitcoinContext({ prices })
    }
    const interval = setInterval(checkingFunction, checkingInterval)
    updateBitcoinContext({ currency: account.settings.displayCurrency })
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }, [active])
}

const App: React.FC = () => {
  const [appContext, updateAppContext] = useReducer(setAppContext, getAppContext())
  const [bitcoinContext, updateBitcoinContext] = useReducer(setBitcoinContext, getBitcoinContext())

  const [messageState, updateMessage] = useReducer(setMessage, getMessage())
  const [{ title: drawerTitle, content: drawerContent, show: showDrawer, onClose: onCloseDrawer }, updateDrawer]
    = useReducer(setDrawer, getDrawer())
  const [overlayState, updateOverlay] = useOverlay()
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>(account?.publicKey ? 'home' : 'welcome')
  const getCurrentPage = () => currentPage

  StatusBar.setBarStyle('dark-content', true)
  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  useEffect(showMessageEffect(messageState.msgKey, width, slideInAnim), [messageState.msgKey, messageState.time])

  useEffect(() => {
    if (DEV !== 'true' && ISEMULATOR) {
      error(new Error('NO_EMULATOR'))
      updateMessage({ msgKey: 'NO_EMULATOR', level: 'ERROR' })

      return
    }

    ;(async () => {
      await initApp(navigationRef, updateMessage)
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
      if (typeof account.settings.enableAnalytics === 'undefined') {
        showAnalyticsPrompt(updateOverlay)
      }

      if (!compatibilityCheck(APPVERSION, MINAPPVERSION)) {
        updateMessage({
          msgKey: 'CRITICAL_UPDATE_AVAILABLE',
          level: 'ERROR',
          keepAlive: true,
          action: {
            callback: linkToAppStore,
            label: i18n('download'),
            icon: 'download',
          },
        })
      } else if (!compatibilityCheck(APPVERSION, LATESTAPPVERSION)) {
        updateMessage({
          msgKey: 'UPDATE_AVAILABLE',
          level: 'WARN',
          keepAlive: true,
          action: {
            callback: linkToAppStore,
            label: i18n('download'),
            icon: 'download',
          },
        })
      }
    })()
  }, [])

  useEffect(
    handleNotificationsEffect({
      getCurrentPage,
      updateOverlay,
      navigation: navigationRef,
    }),
    [currentPage],
  )

  useEffect(websocket(updatePeachWS, updateMessage), [])
  usePartialAppSetup()

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
    // Disable OS back button
    analytics().logScreenView({
      screen_name: currentPage as string,
    })
  }, [currentPage])

  return (
    <GestureHandlerRootView>
      <AvoidKeyboard>
        <SafeAreaView>
          <QueryClientProvider client={queryClient}>
            <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
              <PeachWSContext.Provider value={peachWS}>
                <AppContext.Provider value={[appContext, updateAppContext]}>
                  <BitcoinContext.Provider value={[bitcoinContext, updateBitcoinContext]}>
                    <MessageContext.Provider value={[messageState, updateMessage]}>
                      <DrawerContext.Provider
                        value={[{ title: '', content: null, show: false, onClose: () => {} }, updateDrawer]}
                      >
                        <OverlayContext.Provider value={[defaultOverlay, updateOverlay]}>
                          <NavigationContainer theme={navTheme} ref={navigationRef} onStateChange={onNavStateChange}>
                            <Background>
                              <View style={tw`h-full flex-col`}>
                                <Drawer
                                  title={drawerTitle}
                                  content={drawerContent}
                                  show={showDrawer}
                                  onClose={onCloseDrawer}
                                />
                                <Overlay {...overlayState} />
                                {!!messageState.msgKey && (
                                  <Animated.View style={[tw`absolute z-20 w-full`, { top: slideInAnim }]}>
                                    <Message {...messageState} />
                                  </Animated.View>
                                )}
                                <View style={tw`h-full flex-shrink`}>
                                  <Stack.Navigator
                                    detachInactiveScreens={true}
                                    screenOptions={{
                                      gestureEnabled: false,
                                      headerShown: false,
                                    }}
                                  >
                                    {views.map(({ name, component }) => (
                                      <Stack.Screen
                                        {...{ name, component }}
                                        key={name}
                                        options={{
                                          animationEnabled: false,
                                          headerShown: showHeader(name),
                                          header: () => <Header />,
                                        }}
                                      />
                                    ))}
                                  </Stack.Navigator>
                                </View>
                                {showFooter(currentPage) && (
                                  <Footer style={tw`z-10`} active={currentPage} setCurrentPage={setCurrentPage} />
                                )}
                              </View>
                            </Background>
                          </NavigationContainer>
                        </OverlayContext.Provider>
                      </DrawerContext.Provider>
                    </MessageContext.Provider>
                  </BitcoinContext.Provider>
                </AppContext.Provider>
              </PeachWSContext.Provider>
            </LanguageContext.Provider>
          </QueryClientProvider>
        </SafeAreaView>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
export default App
