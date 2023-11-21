type OfferDraft = {
  type: 'bid' | 'ask'
  meansOfPayment: MeansOfPayment
  paymentData: OfferPaymentData
  originalPaymentData: PaymentData[]
  walletLabel?: string
  tradeStatus?: TradeStatus
}

type Offer = Omit<OfferDraft, 'originalPaymentData'> & {
  id: string
  creationDate: Date
  lastModified: Date
  publishingDate?: Date
  online: boolean

  user: PublicUser
  matches: Offer['id'][]
  doubleMatched: boolean
  contractId?: string
  escrowFee: number
  freeTrade: boolean

  tradeStatus: TradeStatus
}

type SellOfferDraft = OfferDraft & {
  type: 'ask'
  amount: number
  premium: number
  returnAddress: string
  funding: FundingStatus
  multi?: number
}
type SellOffer = Omit<SellOfferDraft & Offer, 'originalPaymentData'> & {
  escrow?: string
  escrowNotifiedUser?: boolean
  tx?: string
  refundTx?: string // base 64 encoded psbt
  releaseTx?: string
  txId?: string
  refunded: boolean
  released: boolean
  fundingAmountDifferent: boolean
  publicKey: string

  oldOfferId?: string
  newOfferId?: string
  prices?: Pricebook
}

type BuyOfferDraft = OfferDraft & {
  type: 'bid'
  releaseAddress: string
  amount: [number, number]
  messageSignature?: string
  maxPremium: number | null
}

type BuyOffer = Omit<BuyOfferDraft & Offer, 'originalPaymentData'>
