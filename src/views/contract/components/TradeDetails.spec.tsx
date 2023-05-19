import { contract as mockContract } from '../../../../tests/unit/data/contractData'
import { TradeDetails } from './TradeDetails'
import { createRenderer } from 'react-test-renderer/shallow'

const useContractContextMock = jest.fn(() => ({
  contract: mockContract,
  view: 'buyer',
}))
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TradeDetails', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<TradeDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for past trade', () => {
    useContractContextMock.mockImplementationOnce(() => ({
      contract: { ...mockContract, tradeStatus: 'tradeCompleted', releaseTxId: '123' },
      view: 'seller',
    }))
    renderer.render(<TradeDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
