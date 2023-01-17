declare type RootStackParamList = {
  home: undefined
  newUser: {
    referralCode?: string
  }
  restoreBackup: undefined
  wallet: undefined
  transactionHistory: undefined
  transactionDetails: {
    txId: string
  }
  buy: undefined
  sell: undefined
  buyPreferences: { amount: [number, number] }
  sellPreferences: { amount: number }
  addPaymentMethod: {
    currencies?: Currency[]
    country?: Country
    paymentMethod?: PaymentMethod
    origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  }
  paymentDetails: {
    paymentData: Partial<PaymentData> & {
      type: PaymentMethod
      currencies: Currency[]
    }
    origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
    originOnCancel?: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  }
  fundEscrow: {
    offer: SellOffer
  }
  setReturnAddress: {
    offer: SellOffer
  }
  search: undefined
  contract: {
    contractId: Contract['id']
    contract?: Contract
  }
  contractChat: {
    contractId: Contract['id']
  }
  dispute: {
    contractId: Contract['id']
  }
  tradeComplete: {
    contract: Contract
  }
  yourTrades: undefined
  offer: {
    offerId: string
  }
  settings: undefined
  contact: undefined
  report: {
    reason: ContactReason
    topic?: string
    message?: string
    shareDeviceID?: boolean
  }
  language: undefined
  currency: undefined
  publicProfile: undefined
  referrals: undefined
  backups: undefined
  backupCreated: undefined
  seedWords: undefined
  payoutAddress: undefined
  walletSettings: undefined
  paymentMethods: undefined
  deleteAccount: undefined
  peachFees: undefined
  networkFees: undefined
  aboutPeach: undefined
  bitcoinProducts: undefined
  socials: undefined
  welcome: undefined
  splashScreen: undefined
  myProfile: undefined
  testView: undefined
  testViewButtons: undefined
  testViewPopups: undefined
  testViewMessages: undefined
  testViewComponents: undefined
}

type KeysWithUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

declare type ScreenWithoutProps = KeysWithUndefined<RootStackParamList>
