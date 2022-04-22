interface Global {
  ErrorUtils: {
    setGlobalHandler: any
    reportFatalError: any
    getGlobalHandler: any
  }
}

declare const global: Global

declare type ComponentProps = {
  children?: ReactNode,
  style?: ViewStyle|ViewStyle[],
}

declare type AnyObject = {
  [key: string]: any
}

type BitcoinNetwork = 'bitcoin' | 'testnet' | 'regtest'

declare type Rating = {
  creationDate: Date,
  rating: -1 | 1,
  ratedBy: string,
  signature: string,
}
declare type User = {
  id: string,
  creationDate: Date,
  rating: number,
  userRating: number,
  ratingCount: number,
  peachRating: number,
  ratings?: Rating[],
  pgpPublicKey: string,
  pgpPublicKeyProof: string,
}

declare type PaymentData = {
  [key: string]: any,
  id: string,
  type: PaymentMethod,
  selected?: boolean,
}

declare type Offer = {
  id?: string,
  creationDate: Date,
  online?: boolean,
  user?: User,
  published: boolean,
  amount: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  matches: string[],
  doubleMatched: boolean,
  contractId?: string,
}

declare type SellOffer = Offer & {
  type: 'ask',
  premium: number,
  paymentData: PaymentData[],
  kycType?: KYCType,
  depositAddress?: string,
  returnAddress?: string,
  confirmedReturnAddress?: boolean,
  escrow?: string,
  funding?: FundingStatus,
  tx?: string,
  txId?: string,
  refunded: boolean,
  released: boolean,
}

declare type BuyOffer = Offer & {
  type: 'bid'
  releaseAddress?: string,
}

declare type ContractAction = 'none' | 'kycResponse' | 'paymentMade' | 'paymentConfirmed'

declare type Contract = {
  creationDate: Date,
  id: string,
  seller: User,
  buyer: User,

  symmetricKeyEncrypted: string,
  symmetricKey?: string,
  symmetricKeySignature: string,

  amount: number,
  currency: Currency,
  price: number,
  paymentMethod: PaymentMethod,
  paymentDataEncrypted?: string,
  paymentData?: PaymentData,
  paymentDataSignature?: string,

  contractErrors?: string[],

  kycRequired: boolean,
  kycType?: KYCType,

  kycConfirmed?: boolean,
  kycResponseDate?: Date|null,
  paymentMade: Date|null,
  paymentConfirmed: Date|null,

  releaseAddress: string,
  releaseTransaction: string,
  releaseTxId?: string,

  disputeActive: boolean,
  canceled: boolean,

  ratingBuyer: boolean,
  ratingSeller: boolean,
}

declare type Message = {
  roomId: string,
  from: User['id'],
  date: Date,
  message?: string,
  signature: string,
}

declare type Settings = {
  skipTutorial?: boolean,
  amount?: number,
  currencies?: Currency[],
  paymentMethods?: PaymentMethod[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
  pgpPublished?: boolean,
}

declare type PGPKeychain = {
  privateKey: string,
  publicKey: string,
}

declare type Account = {
  publicKey: string,
  privKey?: string,
  mnemonic?: string,
  pgp: PGPKeychain,
  settings: Settings,
  paymentData: PaymentData[],
  offers: (SellOffer|BuyOffer)[],
  contracts: Contract[],
  chats: {
    [key: string]: Message[]
  }
}

declare type MessageState = {
  msg: string,
  level: Level,
  time?: number,
}
declare type OverlayState = {
  content: ReactNode,
  showCloseButton: boolean,
}
declare type BitcoinContextType = {
  currency: Currency,
  price: number,
  satsPerUnit: number,
  prices: Pricebook,
}

declare type Session = {
  initialized: boolean
  password?: string
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}
