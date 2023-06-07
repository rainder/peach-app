import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetofferDetailsProps = RequestProps & {
  offerId: string
}

export const getOfferDetails = async ({ offerId, timeout, abortSignal }: GetofferDetailsProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/details`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<BuyOffer | SellOffer>(response, 'getOffer')
}
