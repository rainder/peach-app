import { View } from 'react-native'
import { act, fireEvent, render } from 'test-utils'
import { transactionError } from '../../../../tests/unit/data/errors'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmTransactionPopup } from './ConfirmTransactionPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('ConfirmTransactionPopup', () => {
  const onSuccess = jest.fn()
  const amount = 100000
  const props = {
    title: 'title',
    content: <View />,
    psbt: getTransactionDetails(amount, 10, 'txid').psbt,
    onSuccess,
  }
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet({}))
  })
  it('should render correctly', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(props.psbt)
    const { getByText } = render(<ConfirmTransactionPopup {...props} />)
    await act(async () => {
      await fireEvent.press(getByText('confirm & send'))
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(props.psbt)
    expect(onSuccess).toHaveBeenCalled()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.balance = amount
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })
    const { getByText } = render(<ConfirmTransactionPopup {...props} />)
    await act(async () => {
      await fireEvent.press(getByText('confirm & send'))
    })

    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
  })
})
