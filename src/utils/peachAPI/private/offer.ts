/* eslint-disable max-lines */
import { API_URL } from '@env'
import { error, info } from '../../logUtils'
import { getAccessToken } from './auth'

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async (): Promise<[Offer[]|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - getOffers', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getOffers', e)


    return [null, { error: err }]
  }
}

type PostOfferProps = {
  type: OfferType,
  amount: string,
  premium?: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  hashedPaymentData?: string,
  kyc: boolean,
  returnAddress?: string,
  releaseAddress?: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param amount Amount in sats (250k 500k 1M 2M 5M)
 * @param premium Premium in % (default: 0)
 * @param currencies Post offer of specific currency
 * @param paymentMethods Post offer for specific payment methods
 * @param kyc If true, require KYC
 * @param returnAddress Bitcoin address to return funds to in case of cancellation
 * @returns PostOfferResponse
 */
export const postOffer = async ({
  type,
  amount,
  premium = 0,
  currencies,
  paymentMethods,
  hashedPaymentData,
  kyc,
  returnAddress,
  releaseAddress
}: PostOfferProps): Promise<[PostOfferResponse|null, APIError|null]> => {

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return [null, { error: 'AUTHENTICATION_FAILED' }]

    const response = await fetch(`${API_URL}/v1/offer`, {
      headers: {
        Authorization: accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        type,
        amount,
        premium,
        currencies,
        paymentMethods,
        hashedPaymentData,
        kyc,
        returnAddress,
        releaseAddress
      })
    })

    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - postOffer', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - postOffer', e)

    return [null, { error: err }]
  }
}

type CreateEscrowProps = {
  offerId: string,
  publicKey: string
}

/**
 * @description Method to create escrow for offer
 * @param offerId offer id
 * @param publicKey Seller public key needed for verifying seller signature for release transaction
 * @returns FundingStatus
 */
export const createEscrow = async ({
  offerId,
  publicKey
}: CreateEscrowProps): Promise<[CreateEscrowResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey
    })
  })

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - createEscrow', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - createEscrow', e)


    return [null, { error: err }]
  }
}


type GetFundingStatusProps = {
  offerId: string,
}

/**
 * @description Method to get funding status of offer
 * @param offerId offer id
 * @returns FundingStatus
 */
export const getFundingStatus = async ({
  offerId
}: GetFundingStatusProps): Promise<[FundingStatusResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET',
  })

  try {
    const result = await response.json()

    info('peachAPI - getFundingStatus', result)

    return [await result, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getFundingStatus', e)


    return [null, { error: err }]
  }
}

type GetMatchesProps = {
  offerId: string,
}

/**
 * @description Method to get matches of an offer
 * @returns GetOffersResponse
 */
export const getMatches = async ({
  offerId
}: GetMatchesProps): Promise<[GetMatchesResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - getMatches', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getMatches', e)

    return [null, { error: err }]
  }
}


type MatchProps = {
  offerId: string,
  matchingOfferId: string,
}

/**
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const matchOffer = async ({
  offerId,
  matchingOfferId
}: MatchProps): Promise<[MatchResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      matchingOfferId
    }),
    method: 'POST'
  })

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - matchOffer', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - matchOffer', e)

    return [null, { error: err }]
  }
}


/**
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const unmatchOffer = async ({
  offerId,
  matchingOfferId
}: MatchProps): Promise<[MatchResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      matchingOfferId
    }),
    method: 'DELETE'
  })

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - unmatchOffer', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - unmatchOffer', e)

    return [null, { error: err }]
  }
}