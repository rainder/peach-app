import { render, waitFor } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { TradeComplete } from './TradeComplete'

const logTradeCompletedMock = jest.fn()
jest.mock('../../utils/analytics/logTradeCompleted', () => ({
  logTradeCompleted: (...args: unknown[]) => logTradeCompletedMock(...args),
}))

jest.useFakeTimers()

describe('TradeComplete', () => {
  it('logs trade completed analytics once', async () => {
    const { rerender } = render(<TradeComplete contractId={contract.id} />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    rerender(<TradeComplete contractId={contract.id} />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(logTradeCompletedMock).toHaveBeenCalledWith(contract)
    expect(logTradeCompletedMock).toHaveBeenCalledTimes(1)
  })
})
