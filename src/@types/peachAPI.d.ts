/* eslint-disable max-lines */
declare type WSCallback = (message?: any) => void
declare type PeachWS = {
  ws?: WebSocket
  authenticated: boolean
  connected: boolean
  queue: (() => boolean)[]
  listeners: {
    message: WSCallback[]
    close: (() => void)[]
  }
  on: (listener: 'message' | 'close', callback: WSCallback) => void
  off: (listener: 'message' | 'close', callback: WSCallback) => void
  send: (data: string) => boolean
  close: WebSocket['close']
  onmessage?: WebSocket['onmessage'] | (() => {})
}

declare type ContractUpdate = {
  contractId: Contract['id']
  event: 'paymentMade' | 'paymentConfirmed'
  data: {
    date: number
  }
}

declare type AccessToken = {
  expiry: number
  accessToken: string
}

declare type APISuccess = {
  success: true
}

declare type APIError = {
  error: string
  details?: unknown
}

declare type FeeRate = 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee' | 'custom'

declare type User = {
  id: string
  creationDate: Date
  trades: number
  rating: number
  userRating: number
  ratingCount: number
  peachRating: number
  medals: Medal[]
  referralCode?: string
  usedReferralCode?: string
  bonusPoints: number
  referredTradingAmount: number
  disputes: {
    opened: number
    won: number
    lost: number
  }
  pgpPublicKey: string
  pgpPublicKeyProof: string
}

declare type SelfUser = User & {
  feeRate: FeeRate
  freeTrades: number
  maxFreeTrades: number
  historyRating: number
  recentRating: number
}

declare type TradingLimit = {
  daily: number
  dailyAmount: number
  yearly: number
  yearlyAmount: number
  monthlyAnonymous: number
  monthlyAnonymousAmount: number
}

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type Currency =
  | 'USD'
  | 'EUR'
  | 'CHF'
  | 'GBP'
  | 'SEK'
  | 'DKK'
  | 'BGN'
  | 'CZK'
  | 'HUF'
  | 'PLN'
  | 'RON'
  | 'ISK'
  | 'NOK'
  | 'RON'
declare type Pricebook = {
  [key in Currency]?: number
}
declare type PaymentMethodCountry =
  | 'BE'
  | 'BG'
  | 'CA'
  | 'CH'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'ES'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'IT'
  | 'NL'
  | 'PL'
  | 'PT'
  | 'SE'
  | 'SI'
  | 'RO'
  | 'UK'
  | 'US'
  | 'FI'
  | 'BG'
  | 'CZ'
  | 'DK'
  | 'HU'
  | 'NO'
  | 'PL'
  | 'PO'
  | 'RO'
  | 'HR'

declare type Location = 'amsterdam' | 'belgianEmbassy' | 'lugano'

declare type CashTrade = 'cash' | `cash.${string}`
declare type AmazonGiftCard = 'giftCard.amazon' | `giftCard.amazon.${PaymentMethodCountry}`
declare type NationalTransfer = `nationalTransfer${PaymentMethodCountry}`
declare type PaymentMethod =
  | 'sepa'
  | 'instantSepa'
  | 'advcash'
  | 'paypal'
  | 'fasterPayments'
  | 'revolut'
  | 'vipps'
  | 'blik'
  | 'wise'
  | 'twint'
  | 'satispay'
  | 'swish'
  | 'mbWay'
  | 'bizum'
  | 'mobilePay'
  | 'skrill'
  | 'neteller'
  | 'paysera'
  | 'keksPay'
  | 'straksbetaling'
  | 'friends24'
  | 'n26'
  | 'paylib'
  | 'lydia'
  | 'verse'
  | 'iris'
  | CashTrade
  | AmazonGiftCard
  | NationalTransfer

declare type MeetupEvent = {
  id: string
  currencies: Currency[]
  country: PaymentMethodCountry
  city: string
  shortName: string
  longName: string
  url?: string
  address?: string
  frequency?: string
  logo?: string
}
declare type CountryEventsMap = Record<Country, MeetupEvent[]>

declare type PaymentMethodInfo = {
  id: PaymentMethod
  currencies: Currency[]
  countries?: PaymentMethodCountry[]
  rounded?: boolean
  anonymous: boolean
}

declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED' | 'WRONG_FUNDING_AMOUNT' | 'CANCELED'
  confirmations?: number
  txIds: string[]
  vouts: number[]
  amounts: number[]
  expiry: number
}

declare type GetStatusResponse = {
  error: null
  status: 'online'
  serverTime: number
}

declare type GetInfoResponse = {
  peach: {
    pgpPublicKey: string
  }
  fees: {
    escrow: number
  }
  paymentMethods: PaymentMethodInfo[]
  latestAppVersion: string
  minAppVersion: string
}
declare type PeachInfo = GetInfoResponse

declare type GetTxResponse = Transaction
declare type PostTxResponse = {
  txId: string
}

declare type PeachPairInfo = {
  pair: TradingPair
  price: number
}
declare type MeansOfPayment = Partial<Record<Currency, PaymentMethod[]>>

declare type TradeStatus =
  | 'fundEscrow'
  | 'escrowWaitingForConfirmation'
  | 'fundingAmountDifferent'
  | 'searchingForPeer'
  | 'offerHidden'
  | 'offerHiddenWithMatchesAvailable'
  | 'hasMatchesAvailable'
  | 'offerCanceled'
  | 'refundAddressRequired'
  | 'refundTxSignatureRequired'
  | 'paymentRequired'
  | 'confirmPaymentRequired'
  | 'dispute'
  | 'releaseEscrow'
  | 'rateUser'
  | 'confirmCancelation'
  | 'tradeCompleted'
  | 'tradeCanceled'
  | 'refundOrReviveRequired'
  | 'waiting'

declare type OfferDraft = {
  creationDate: Date
  lastModified?: Date
  type: 'bid' | 'ask'
  meansOfPayment: MeansOfPayment
  paymentData: Partial<
    Record<
      PaymentMethod,
      {
        hash: string
        country?: PaymentMethodCountry
      }
    >
  >
  originalPaymentData: PaymentData[]
  walletLabel?: string
  tradeStatus?: TradeStatus
}
declare type Offer = OfferDraft & {
  id: string
  oldOfferId?: string
  newOfferId?: string
  publishingDate?: Date
  online: boolean
  user?: User
  publicKey?: string
  premium?: number
  prices?: Pricebook
  refunded?: boolean
  funding?: FundingStatus
  matches: Offer['id'][]
  doubleMatched: boolean
  contractId?: string
  tradeStatus: TradeStatus
}

declare type PostOfferResponseBody = BuyOffer | SellOffer
declare type OfferType = 'ask' | 'bid'

declare type CreateEscrowResponse = {
  offerId: string
  escrow: string
  funding: FundingStatus
}
declare type FundingError = '' | 'NOT_FOUND' | 'UNAUTHORIZED'
declare type FundingStatusResponse = {
  offerId: string
  escrow: string
  funding: FundingStatus
  error?: FundingError
  returnAddress: string
  userConfirmationRequired: boolean
}

declare type CancelOfferRequest = {
  satsPerByte?: number
}
declare type CancelOfferResponse = {
  psbt: string
  returnAddress: string
  amount: number
  fees: number
  satsPerByte: number
}

declare type MatchUnavailableReasons = {
  exceedsLimit: (keyof TradingLimit)[]
}

declare type Match = {
  user: User
  offerId: string
  amount: number
  escrow?: string
  prices: Pricebook
  matchedPrice: number | null
  premium: number
  meansOfPayment: MeansOfPayment
  paymentData: Offer['paymentData']
  selectedCurrency?: Currency
  selectedPaymentMethod?: PaymentMethod
  symmetricKeyEncrypted: string
  symmetricKeySignature: string
  matched: boolean
  unavailable: MatchUnavailableReasons
}
declare type GetMatchesResponse = {
  offerId: string
  matches: Match[]
  totalMatches: number
  nextPage: number

  /** @deprecated */
  remainingMatches: number
}
declare type MatchResponse = {
  success: true
  matchedPrice?: number
  contractId?: string
  refundTx?: string
}

declare type OfferSummary = {
  id: string
  type: 'bid' | 'ask'
  creationDate: Date
  lastModified: Date
  amount: number | [number, number]
  matches: string[]
  prices: Pricebook
  tradeStatus: TradeStatus
  contractId?: string
  txId?: string
}
declare type GetOffersResponse = (BuyOffer | SellOffer)[]
declare type GetOfferSummariesResponse = OfferSummary[]

declare type GetContractResponse = Contract

declare type ContractSummary = {
  id: string
  offerId: string
  type: 'bid' | 'ask'
  creationDate: Date
  lastModified: Date
  paymentMade?: Date
  paymentConfirmed?: Date
  tradeStatus: TradeStatus
  amount: number
  price: number
  currency: Currency
  disputeWinner?: Contract['disputeWinner']
  unreadMessages: number
  releaseTxId?: string
}
declare type GetContractsResponse = Contract[]
declare type GetContractSummariesResponse = ContractSummary[]

declare type ConfirmPaymentResponse = {
  success: true
  txId?: string
}

declare type GetChatResponse = Message[]

declare type PostChatProps = {
  contractId: Contract['id']
  message: string
  signature: string
}

declare type CancelContractResponse = {
  success: true
  psbt?: string
}

declare type FundEscrowResponse = {
  txId: string
}

declare type GenerateBlockResponse = {
  txId: string
}

declare type FeeRecommendation = {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}
declare type GetFeeEstimateResponse = FeeRecommendation
declare type TradeSummary = (OfferSummary | ContractSummary) & {
  paymentMade?: Date
  unreadMessages?: number
}

declare type ReviveSellOfferResponseBody = {
  newOfferId: Offer['id']
}

declare type ExtendPaymentTimerResponseBody = APISuccess

declare type NotificationType =
  | 'user.badge.unlocked' // PN-U01
  | 'offer.escrowFunded' // PN-S03
  | 'offer.notFunded' // PN-S02
  | 'offer.fundingAmountDifferent' // PN-S07
  | 'offer.wrongFundingAmount' // PN-S08
  | 'offer.sellOfferExpired' // PN-S06
  | 'offer.matchBuyer' // PN-B02
  | 'offer.matchSeller' // PN-S09
  | 'offer.outsideRange' // PN-S10
  | 'contract.contractCreated' // PN-B03
  | 'contract.buyer.paymentReminderSixHours' // PN-B04
  | 'contract.buyer.paymentReminderOneHour' // PN-B05
  | 'contract.buyer.paymentTimerHasRunOut' // PN-B12
  | 'contract.buyer.paymentTimerSellerCanceled' // PN-B06
  | 'contract.buyer.paymentTimerExtended' // PN-B07
  | 'contract.seller.paymentTimerHasRunOut' // PN-S12
  | 'contract.seller.canceledAfterEscrowExpiry' // PN-S14
  | 'contract.paymentMade' // PN-S11
  | 'contract.tradeCompleted' // PN-B09
  | 'contract.chat' // PN-A03
  | 'contract.buyer.disputeRaised' // PN-D01
  | 'contract.seller.disputeRaised' // PN-D01
  | 'contract.disputeResolved' // PN-D04
  | 'contract.buyer.disputeWon' // PN-D02
  | 'contract.buyer.disputeLost' // PN-D03
  | 'contract.seller.disputeWon' // PN-D02
  | 'contract.seller.disputeLost' // PN-D03
  | 'contract.canceled' // PN-S13
  | 'contract.cancelationRequest' // PN-B08
  | 'contract.cancelationRequestAccepted' // PN-S15
  | 'contract.cancelationRequestRejected' // PN-S16
  | 'offer.buyOfferExpired' // PN-B14

declare type PNData = {
  type?: NotificationType
  badges?: string
  offerId?: string
  contractId?: string
  isChat?: string
}

declare type PNNotification = {
  titleLocArgs?: string[]
  bodyLocArgs?: string[]
}

declare type RefundSellOfferResponse = APISuccess

declare type CheckReferralCodeResponse = {
  valid: boolean
}

declare type RedeemReferralCodeResponseBody = APISuccess & { bonusPoints: User['bonusPoints'] }
declare type RegisterResponseBody = AccessToken & { restored: boolean }
