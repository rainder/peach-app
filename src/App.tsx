import analytics from '@react-native-firebase/analytics'
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native'
import { useEffect, useReducer } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Drawer, Message, Popup } from './components'

import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import { QueryClientProvider } from '@tanstack/react-query'
import { Background } from './components/background/Background'
import { useMessageState } from './components/message/useMessageState'
import { GlobalHandlers } from './GlobalHandlers'
import { initWebSocket } from './init/websocket'
import { queryClient } from './queryClient'
import { usePartialAppSetup } from './usePartialAppSetup'
import { info } from './utils/log'
import { Screens } from './views/Screens'

enableScreens()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

export const App = () => {
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())

  const updateMessage = useMessageState((state) => state.updateMessage)
  useEffect(initWebSocket(updatePeachWS, updateMessage), [])
  usePartialAppSetup()

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  const onNavStateChange = (state?: NavigationState) => {
    const newPage = state?.routes[state.routes.length - 1].name
    info('Navigation event', newPage)
    analytics().logScreenView({
      screen_name: newPage,
    })
  }

  return (
    <GestureHandlerRootView>
      <AvoidKeyboard>
        <QueryClientProvider client={queryClient}>
          <PeachWSContext.Provider value={peachWS}>
            <NavigationContainer theme={navTheme} onStateChange={onNavStateChange}>
              <GlobalHandlers />
              <Background>
                <Drawer />
                <Popup />
                <Message />

                <Screens />
              </Background>
            </NavigationContainer>
          </PeachWSContext.Provider>
        </QueryClientProvider>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
