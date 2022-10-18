import NotificationBadge from '@msml/react-native-notification-badge'
import messaging from '@react-native-firebase/messaging'
import { AppRegistry, LogBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import * as db from './utils/db'
import { error, info } from './utils/log'
import { updateUser } from './utils/peachAPI'
import { getSession, initSession, setSessionItem } from './utils/session'
import { isIOS, isProduction, isWeb, parseError } from './utils/system'

// TODO check if these messages have a fix
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  // eslint-disable-next-line max-len
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!',
  /ViewPropTypes will be removed from React Native./u,
  /RCTBridge required dispatch_sync/u,
  /Can't perform a React state update on an unmounted component/u,
  /Require cycle/u,
  // Webview (shadows)
  /Did not receive response to shouldStartLoad in time/u,
  /startLoadWithResult invoked with invalid lockIdentifier/u,
  /ERROR/u,
])

LogBox.ignoreAllLogs(isProduction())

try {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    await initSession()
    let notifications = Number(getSession().notifications || 0)
    notifications += 1

    if (isIOS()) NotificationBadge.setNumber(notifications)
    setSessionItem('notifications', notifications)

    info('Message handled in the background!', remoteMessage)
  })
  messaging().onTokenRefresh((fcmToken) => updateUser({ fcmToken }))
} catch (e) {
  error('messaging().setBackgroundMessageHandler/onTokenRefresh - Push notifications not supported', parseError(e))
}

AppRegistry.registerComponent(appName, () => App)

if (typeof document !== 'undefined') {
  // start webapp if document available
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

const init = async () => {
  if (isWeb()) await db.init(process.env.NODE_ENV !== 'production')
}

init()

export default () => {}
