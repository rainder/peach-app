import { useCallback, useContext, useMemo, useState } from 'react'
import { AppState } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import { shallow } from 'zustand/shallow'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../../utils/system'
import { NotificationPopup } from '../components/NotificationPopup'
import { SettingsItemProps } from '../components/SettingsItem'

const headerConfig = { title: i18n('settings.title'), hideGoBackButton: true }

const contactUs = (() => {
  let arr: SettingsItemProps[] = [{ title: 'contact' }, { title: 'aboutPeach' }]
  if (!isProduction()) arr = [{ title: 'testView' }, ...arr]
  return arr
})()

export const useSettingsSetup = () => {
  const navigation = useNavigation()
  useHeaderSetup(headerConfig)
  const [, updateOverlay] = useContext(OverlayContext)
  const [notificationsOn, setNotificationsOn] = useState(false)
  const [peachWalletActive, togglePeachWallet, enableAnalytics, toggleAnalytics, showBackupReminder] = useSettingsStore(
    (state) => [
      state.peachWalletActive,
      state.togglePeachWallet,
      state.enableAnalytics,
      state.toggleAnalytics,
      state.showBackupReminder,
    ],
    shallow,
  )

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        setNotificationsOn(await checkNotificationStatus())
      }
      const eventListener = AppState.addEventListener('change', checkingFunction)

      checkingFunction()

      return () => {
        eventListener.remove()
      }
    }, []),
  )

  const goToCurrencySettings = useCallback(() => navigation.navigate('currency'), [navigation])

  const notificationClick = useCallback(() => {
    if (notificationsOn) {
      updateOverlay({
        title: i18n('settings.notifications.overlay.title'),
        content: <NotificationPopup />,
        visible: true,
        level: 'WARN',
        action2: {
          callback: () => updateOverlay({ visible: false }),
          label: i18n('settings.notifications.overlay.neverMind'),
          icon: 'arrowLeftCircle',
        },
        action1: {
          callback: () => {
            updateOverlay({ visible: false })
            toggleNotifications()
          },
          label: i18n('settings.notifications.overlay.yes'),
          icon: 'slash',
        },
      })
    } else {
      toggleNotifications()
    }
  }, [notificationsOn, updateOverlay])

  const profileSettings: SettingsItemProps[] = useMemo(
    () => [
      { title: 'myProfile' },
      { title: 'referrals' },
      {
        title: 'backups',
        iconId: showBackupReminder ? 'alertTriangle' : undefined,
        warning: !!showBackupReminder,
      },
      { title: 'networkFees' },
      { title: 'paymentMethods' },
    ],
    [showBackupReminder],
  )

  const appSettings: SettingsItemProps[] = useMemo(
    () => [
      {
        title: 'analytics',
        onPress: toggleAnalytics,
        iconId: enableAnalytics ? 'toggleRight' : 'toggleLeft',
        enabled: enableAnalytics,
      },
      {
        title: 'notifications',
        onPress: notificationClick,
      },
      {
        title: 'peachWallet',
        onPress: togglePeachWallet,
        iconId: peachWalletActive ? 'toggleRight' : 'toggleLeft',
        enabled: peachWalletActive,
      },
      { title: 'payoutAddress' },
      { title: 'currency', onPress: goToCurrencySettings },
    ],
    [toggleAnalytics, enableAnalytics, notificationClick, togglePeachWallet, peachWalletActive, goToCurrencySettings],
  )

  const settings = [
    { items: contactUs },
    { headline: 'profileSettings', items: profileSettings },
    { headline: 'appSettings', items: appSettings },
  ]

  return settings
}
