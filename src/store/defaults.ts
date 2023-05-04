import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../constants'
import i18n from '../utils/i18n'

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: '',
  peachFee: 0.015,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
}

export const defaultSettings: Settings = {
  appVersion: APPVERSION,

  enableAnalytics: false,
  analyticsPopupSeen: undefined,

  lastBackupDate: undefined,
  lastFileBackupDate: undefined,
  lastSeedBackupDate: undefined,
  showBackupReminder: true,

  country: undefined,
  locale: i18n.getLocale(),
  displayCurrency: 'EUR',

  meansOfPayment: {},
  preferredPaymentMethods: {},

  premium: 1.5,

  minBuyAmount: defaultConfig.minTradingAmount,
  maxBuyAmount: defaultConfig.maxTradingAmount,
  sellAmount: defaultConfig.minTradingAmount,

  nodeURL: BLOCKEXPLORER,

  returnAddress: undefined,
  payoutAddress: undefined,
  payoutAddressLabel: undefined,
  payoutAddressSignature: undefined,
  peachWalletActive: true,
  derivationPath: undefined,
  feeRate: 'halfHourFee',

  pgpPublished: undefined,
  fcmToken: undefined,
  usedReferralCode: undefined,
}
