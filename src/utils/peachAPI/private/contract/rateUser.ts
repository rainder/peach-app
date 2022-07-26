import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

type RateUserProps = {
  contractId: Contract['id'],
  rating: 1 | -1,
  signature: string
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const rateUser = async ({
  contractId,
  rating,
  signature,
}: RateUserProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/user/rate`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      rating,
      signature,
    })
  })

  return await parseResponse<APISuccess>(response, 'rateUser')
}