export {}

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens')
  return {
    ...actual,
    enableScreens: jest.fn()
  }
})

jest.mock('react-native-share', () => ({
  open: jest.fn()
}))

jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn((size, callback) => {
    let uint8 = new Uint8Array(size)
    uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10)
    callback(null, uint8)
  })
}))

jest.mock('react-native-crypto-js', () => ({
  AES: {
    encrypt: (str: string) => str,
    decrypt: (str: string) => str,
  },
  enc: {
    Utf8: 'utf-8'
  }
}))

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native-qrcode-scanner', () => jest.fn())
jest.mock('react-native-snap-carousel', () => jest.fn())
jest.mock('@react-native-clipboard/clipboard', () => jest.fn())
jest.mock('@env', () => ({
  NETWORK: 'regtest',
  DEV: 'true',
  API_URL: 'https://localhost:8080/',
  HTTP_AUTH_USER: 'value',
  HTTP_AUTH_PASS: 'value2'
}))
