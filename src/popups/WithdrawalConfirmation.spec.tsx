import { render } from 'test-utils'
import { WithdrawalConfirmation } from './WithdrawalConfirmation'

jest.mock('../components/bitcoin/BTCAmount', () => ({
  BTCAmount: 'BTCAmount',
}))

describe('WithdrawalConfirmation', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<WithdrawalConfirmation address="address" amount={123456} fee={110} feeRate={20.1} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
