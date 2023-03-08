// eslint-disable-next-line max-len
import { getNavigationDestinationForContract } from '../../../../src/views/yourTrades/utils/getNavigationDestinationForContract'

jest.mock('../../../../src/utils/contract', () => ({
  getOfferIdFromContract: () => '1',
}))

const getContractMock = jest.fn()
jest.mock('../../../../src/utils/peachAPI', () => ({
  getContract: () => getContractMock(),
}))

afterEach(() => {
  jest.clearAllMocks()
})
describe('getNavigationDestinationForContract', () => {
  it('should navigate to contract', async () => {
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'paymentRequired',
    }

    const [destination, params] = await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('contract')
    expect(params).toEqual({ contractId: '3' })
  })

  it('should navigate to tradeComplete (rate user screen)', async () => {
    const contract = {
      id: '1-2',
    }
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'rateUser',
    }

    getContractMock.mockReturnValue([contract])
    const [destination, params] = await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('tradeComplete')
    expect(params).toEqual({ contract })
  })
})
