import { renderHook, waitFor } from '@testing-library/react-native'
import { queryClientWrapper } from '../../../tests/unit/helpers/queryClientWrapper'
import { placeholderFees, useFeeEstimate } from './useFeeEstimate'
import { estimatedFees } from '../../../tests/unit/data/bitcoinNetworkData'

jest.useFakeTimers()

const apiError = { error: 'UNAUTHORIZED' }
const getFeeEstimateMock = jest.fn().mockResolvedValue([estimatedFees])
jest.mock('../../utils/peachAPI', () => ({
  getFeeEstimate: () => getFeeEstimateMock(),
}))

describe('useFeeEstimate', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches fee estimates from API', async () => {
    const { result } = renderHook(useFeeEstimate, {
      wrapper: queryClientWrapper,
    })
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      estimatedFees,
      isLoading: false,
      error: null,
    })
  })
  it('returns error if server did not return result', async () => {
    getFeeEstimateMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useFeeEstimate, {
      wrapper: queryClientWrapper,
    })
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: false,
      error: new Error(apiError.error),
    })
  })
})
