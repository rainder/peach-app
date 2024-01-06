import { act, fireEvent, render, renderHook } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { account1 } from '../../../tests/unit/data/accountData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { Popup } from '../../components/popup/Popup'
import { setAccount } from '../../utils/account/account'
import { getSellOfferIdFromContract } from '../../utils/contract/getSellOfferIdFromContract'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { getResult } from '../../utils/result/getResult'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { useConfirmCancelTrade } from './useConfirmCancelTrade'

const saveOfferMock = jest.fn()
jest.mock('../../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const contractUpdate = {
  ...contract,
  canceled: true,
}
const sellOfferUpdate = {
  ...sellOffer,
  refundTx: 'refundTx',
}
const cancelContractAsSellerMock = jest.fn().mockResolvedValue(
  getResult({
    contract: contractUpdate,
    sellOffer: sellOfferUpdate,
  }),
)
jest.mock('./helpers/cancelContractAsSeller', () => ({
  cancelContractAsSeller: (...args: unknown[]) => cancelContractAsSellerMock(...args),
}))
const cancelContractAsBuyerMock = jest.spyOn(peachAPI.private.contract, 'cancelContract')
describe('useConfirmCancelTrade', () => {
  beforeAll(() => {
    setAccount({ ...account1, offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }] })
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should show confirm cancelation popup for buyer', async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)
    const { getByText, getAllByText } = render(<Popup />)

    expect(getByText(i18n('contract.cancel.buyer'))).toBeTruthy()
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith({ contractId: contract.id })
  })
  it('should show confirm cancelation popup for seller', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })
    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)
    const { getByText, getAllByText } = render(<Popup />)
    expect(getByText(i18n('contract.cancel.seller'))).toBeTruthy()
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
  })
  it('should show the correct popup for cash trades of the seller', () => {
    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })
    const { getByText } = render(<Popup />)
    expect(getByText(i18n('contract.cancel.cash.text'))).toBeTruthy()
  })
  it('should show the correct confirmation popup for canceled trade as buyer', async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)
    const { getAllByText, queryByText } = render(<Popup />)
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })
    expect(queryByText('cancel trade')).toBeFalsy()
    expect(queryByText('trade canceled!')).toBeTruthy()
  })
  it('should show the correct confirmation popup for canceled trade as seller', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)

    const { getAllByText, queryByText } = render(<Popup />)

    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })

    expect(queryByText('cancel trade')).toBeFalsy()
    expect(queryByText('request sent')).toBeTruthy()
    expect(queryByText(i18n('contract.cancel.requestSent.text'))).toBeTruthy()
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish available', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date() }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })

    const { getByText, queryByText } = render(<Popup />)

    await act(async () => {
      await fireEvent.press(getByText('cancel trade'))
    })

    expect(queryByText('cancel trade')).toBeFalsy()
    expect(queryByText('trade canceled')).toBeTruthy()
    expect(queryByText(i18n('contract.cancel.cash.refundOrRepublish.text'))).toBeTruthy()
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish unavailable', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date(0) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })

    const { getByText, queryByText } = render(<Popup />)

    await act(async () => {
      await fireEvent.press(getByText('cancel trade'))
    })

    expect(queryByText('cancel trade')).toBeFalsy()
    expect(queryByText('trade canceled')).toBeTruthy()
    expect(
      queryByText(i18n('contract.cancel.cash.tradeCanceled.text', contract.id, 'custom payout address')),
    ).toBeTruthy()
  })
})
