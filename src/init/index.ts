import NotificationBadge from '@msml/react-native-notification-badge'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { dataMigration } from '../init/dataMigration'
import events from '../init/events'
import requestUserPermissions from '../init/requestUserPermissions'
import session, { getPeachInfo, getTrades } from '../init/session'
import userUpdate from '../init/userUpdate'
import { account } from '../utils/account'
import { exists } from '../utils/file'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation'
import { sleep } from '../utils/performance'
import { sessionStorage } from '../utils/session'
import { isIOS, parseError } from '../utils/system'

/**
 * @description Method to wait up to 10 seconds for navigation to initialise.
 * @param navigationRef reference to navigation
 * @param updateMessage updateMessage dispatch function
 */
const waitForNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
) => {
  let waitForNavCounter = 100
  while (!navigationRef.isReady()) {
    if (waitForNavCounter === 0) {
      updateMessage({ msgKey: 'NAVIGATION_INIT_ERROR', level: 'ERROR' })
      throw new Error('Failed to initialize navigation')
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
    waitForNavCounter--
  }
}

/**
 * @description Method to init navigation and check where to navigate to first after opening the app
 * @param navigationRef reference to navigation
 * @param updateMessage updateMessage dispatch function
 * @param sessionInitiated true if session has properly initialised
 */
const initialNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
  sessionInitiated: boolean,
) => {
  await waitForNavigation(navigationRef, updateMessage)

  let initialNotification: FirebaseMessagingTypes.RemoteMessage | null = null
  try {
    initialNotification = await messaging().getInitialNotification()
  } catch (e) {
    error('messaging().getInitialNotification - Push notifications not supported', parseError(e))
  }

  if (!sessionInitiated && ((await exists('/peach-account.json')) || (await exists('/peach-account-identity.json')))) {
    // couldn't retrieve account but account files exist, must have not gotten password so we redirect to Login Screen
    navigationRef.navigate('login', {})
  } else if (initialNotification) {
    info('Notification caused app to open from quit state:', JSON.stringify(initialNotification))

    let notifications = sessionStorage.getInt('notifications') || 0
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    sessionStorage.setInt('notifications', notifications)

    if (initialNotification.data) {
      const handledNotification = handlePushNotification(
        navigationRef,
        initialNotification.data,
        initialNotification.sentTime,
      )
      if (!handledNotification) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: account?.publicKey ? 'home' : 'welcome' }],
        })
      }
    }
  } else if (navigationRef.getCurrentRoute()?.name === 'splashScreen') {
    navigationRef.reset({
      index: 0,
      routes: [{ name: account?.publicKey ? 'home' : 'welcome' }],
    })
  }

  messaging().onNotificationOpenedApp((remoteMessage) => {
    info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

    let notifications = sessionStorage.getInt('notifications') || 0
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    sessionStorage.setInt('notifications', notifications)

    if (remoteMessage.data) handlePushNotification(navigationRef, remoteMessage.data, remoteMessage.sentTime)
  })
}

/**
 * @description Method to initialize app by retrieving app session and user account
 * @param navigationRef reference to navigation
 */
export const initApp = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
): Promise<void> => {
  events()
  const sessionInitiated = await session()

  await getPeachInfo(account)
  if (account?.publicKey) {
    getTrades()
    userUpdate()
    dataMigration()
  }

  initialNavigation(navigationRef, updateMessage, sessionInitiated)
  await requestUserPermissions()
}
