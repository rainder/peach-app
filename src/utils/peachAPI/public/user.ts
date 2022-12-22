import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortWithTimeout } from '../../fetch'
import { parseResponse } from '../parseResponse'

type GetUserProps = RequestProps & {
  userId: User['id']
}

/**
 * @description Method get user information
 * @returns User
 */
export const getUser = async ({ userId, timeout }: GetUserProps): Promise<[User | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/${userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<User>(response, 'getUser')
}
