/* eslint-disable max-len */
/* eslint-disable max-lines */

export const buyOffer: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '37',
  online: true,
  type: 'bid',
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  amount: [50000, 250000],
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  tradeStatus: 'waiting',
}

export const sellOffer: SellOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '38',
  online: true,
  type: 'ask',
  meansOfPayment: {
    EUR: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  funding: {
    status: 'NULL',
    txIds: [],
    vouts: [],
    amounts: [],
    expiry: 537,
  },
  amount: 250000,
  premium: 1.5,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  refunded: false,
  released: false,
  tradeStatus: 'waiting',
}

export const wronglyFundedSellOffer: SellOffer = {
  ...sellOffer,
  amount: 42069,
  funding: { ...sellOffer.funding, amounts: [69420] },
}
export const buyOfferUnpublished: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  type: 'bid',
  online: false,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  amount: [250000, 500000],
  tradeStatus: 'offerHidden',
  id: '37',
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const matchOffer: Match = {
  user: {
    id: '1',
    creationDate: new Date('2022-03-08T11:41:07.245Z'),
    trades: 0,
    rating: 0,
    userRating: 0,
    ratingCount: 0,
    peachRating: 0,
    medals: [],
    bonusPoints: 0,
    referredTradingAmount: 0,
    disputes: {
      opened: 0,
      won: 0,
      lost: 0,
    },
    pgpPublicKey: 'TODO add pgp public key',
    pgpPublicKeyProof: 'TODO add pgp',
  },
  offerId: '37',
  prices: {
    EUR: 1,
    CHF: 1.1,
  },
  matchedPrice: 1,
  premium: 1.5,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: ' add payment hash',
    },
  },
  selectedCurrency: 'EUR',
  selectedPaymentMethod: 'sepa',
  symmetricKeyEncrypted: 'TODO add symmetric key encrypted',
  symmetricKeySignature: 'TODO add symmetric key signature',
  matched: true,
  amount: 250000,
  unavailable: {
    exceedsLimit: [],
  },
}
