import { renderHook, waitFor } from '@testing-library/react-native'
import { buyer } from '../../../tests/unit/data/accountData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { QueryClientWrapper, queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useSelfUser } from './useSelfUser'

jest.useFakeTimers()

const getSelfUserMock = jest.fn().mockResolvedValue([buyer])
jest.mock('../../utils/peachAPI', () => ({
  getSelfUser: () => getSelfUserMock(),
}))

const wrapper = QueryClientWrapper

describe('useSelfUser', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('fetches user from API', async () => {
    const { result } = renderHook(useSelfUser, { wrapper })
    expect(result.current).toEqual({
      user: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      user: buyer,
      isLoading: false,
      error: null,
    })
  })
  it('returns error if server did not return result', async () => {
    getSelfUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useSelfUser, { wrapper })
    expect(result.current).toEqual({
      user: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      user: undefined,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
  })
})
