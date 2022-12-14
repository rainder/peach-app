import * as accountData from './data/accountData'
const { version } = require('../../package.json')

export const resetMocks = (...mocks: any) => mocks.forEach((mock: jest.Mock) => (<jest.Mock>mock).mockReset())

jest.mock('../../src/utils/peachAPI', () => ({
  ...jest.requireActual('../../src/utils/peachAPI'),
  ...jest.requireActual('../../src/utils/__mocks__/peachAPI'),
}))

export let fakeFiles: Record<string, string> = {}
export const resetFakeFiles = () => (fakeFiles = {})

jest.mock('react-native-fs', () => ({
  exists: async (path: string): Promise<boolean> => !!fakeFiles[path],
  readFile: async (path: string): Promise<string> => fakeFiles[path],
  writeFile: async (path: string, data: string): Promise<void> => {
    fakeFiles[path] = data
  },
  unlink: async (path: string): Promise<void> => {
    delete fakeFiles[path]
  },
  mkdir: async (): Promise<void> => {},
  readDir: async (): Promise<string[]> => [],
  DocumentDirectoryPath: '',
}))

jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn(),
}))

jest.mock('react-native-fast-openpgp', () => ({
  ...jest.requireActual('react-native-fast-openpgp'),
  generate: () => accountData.account1.pgp,
}))

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn((size, callback) => {
    let uint8 = new Uint8Array(size)
    uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10)
    callback(null, uint8)
  }),
}))

jest.mock('react-native-crypto-js', () => ({
  AES: {
    encrypt: (str: string) => str,
    decrypt: (str: string) => str,
  },
  enc: {
    Utf8: 'utf-8',
  },
}))

jest.mock('@react-native-firebase/messaging', () => () => ({
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
}))
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
}))
jest.mock('@react-native-firebase/analytics', () => () => ({
  logAppOpen: jest.fn(),
  logScreenView: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: jest.fn(),
}))
jest.mock('react-native-device-info', () => ({
  getVersion: () => version,
  getBuildNumber: jest.fn(),
  getUniqueId: () => 'UNIQUE-DEVICE-ID',
  isEmulatorSync: () => true,
}))
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native-canvas')
jest.mock('react-native-webview')
jest.mock('react-native-permissions', () => ({
  checkNotifications: jest.fn(),
}))
jest.mock('react-native-qrcode-scanner', () => jest.fn())
jest.mock('react-native-promise-rejection-utils', () => ({
  setUnhandledPromiseRejectionTracker: jest.fn(),
}))

type Storage = {
  [key: string]: any
}
export let storage: Record<string, Storage> = {}
export const setStorage = (strg: Storage) => (storage = strg)
export const resetStorage = () => (storage = {})

jest.mock('react-native-mmkv-storage', () => ({
  IOSAccessibleStates: {},
  MMKVLoader: jest.fn(() => ({
    setAccessibleIOS: () => ({
      withEncryption: () => ({
        withInstanceID: (instanceId: string) => ({
          initialize: () => {
            storage[instanceId] = {}

            const get = (key: string) => storage[instanceId][key]
            const getAsync = async (key: string) => storage[instanceId][key]
            const store = (key: string, val: any) => (storage[instanceId][key] = val)
            const storeAsync = async (key: string, val: any) => (storage[instanceId][key] = val)
            const remove = (key: string) => delete storage[instanceId][key]

            return {
              setItem: jest.fn().mockImplementation(storeAsync),
              getItem: jest.fn().mockImplementation(getAsync),
              removeItem: jest.fn().mockImplementation(remove),
              getString: jest.fn().mockImplementation(get),
              setString: jest.fn().mockImplementation(store),
              setStringAsync: jest.fn().mockImplementation(storeAsync),
              getArray: jest.fn().mockImplementation(get),
              setArray: jest.fn().mockImplementation(store),
              setArrayAsync: jest.fn().mockImplementation(storeAsync),
              setMap: jest.fn().mockImplementation(store),
              setMapAsync: jest.fn().mockImplementation(storeAsync),
              getMap: jest.fn().mockImplementation(get),
              getBool: jest.fn().mockImplementation(get),
              setBool: jest.fn().mockImplementation(store),
              getBoolAsync: jest.fn().mockImplementation(getAsync),
              indexer: {
                getKeys: jest.fn().mockImplementation(async () => Object.keys(storage[instanceId])),
                maps: {
                  getAll: jest.fn().mockImplementation(async () => storage[instanceId]),
                },
              },
              options: {
                accessibleMode: 'AccessibleAfterFirstUnlock',
              },
            }
          },
        }),
      }),
    }),
  })),
}))

jest.mock('react-native-snap-carousel', () => jest.fn())
jest.mock('react-native-url-polyfill/auto', () => jest.fn())
jest.mock('@react-native-clipboard/clipboard', () => jest.fn())
jest.mock('@env', () => ({
  NETWORK: 'regtest',
  DEV: 'true',
  API_URL: 'https://localhost:8080/',
  HTTP_AUTH_USER: 'value',
  HTTP_AUTH_PASS: 'value2',
}))
