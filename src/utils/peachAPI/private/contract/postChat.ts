import fetch, { getAbortSignal } from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import { getAccessToken } from '../user'

type PostChatProps = RequestProps & {
  contractId: Contract['id']
  message: string
  signature: string
}

/**
 * @description Method to get contract chat
 * @param contractId contract id
 * @param message encrypted message
 * @param signature signature of message
 * @returns Chat log
 */
export const postChat = async ({
  contractId,
  message,
  signature,
  timeout,
}: PostChatProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/chat`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      message,
      signature,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'postChat')
}
