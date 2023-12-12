import { renderHook, responseUtils } from 'test-utils'
import { replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { OfferRepublished } from '../../../popups/tradeCancelation'
import { usePopupStore } from '../../../store/usePopupStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useRepublishOffer } from './useRepublishOffer'

const reviveSellOfferMock = jest.spyOn(peachAPI.private.offer, 'republishSellOffer')

const getSellOfferFromContractMock = jest.fn()
jest.mock('../../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: (contract: Contract) => getSellOfferFromContractMock(contract),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('useRepublishOffer', () => {
  const contract = {
    id: 'contractId',
    cancelConfirmationDismissed: false,
    cancelConfirmationPending: true,
  } as unknown as Contract
  const sellOffer = {
    id: 'offerId',
  }

  it('should revive the sell offer', async () => {
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    const { result } = renderHook(useRepublishOffer)
    await result.current(contract)
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
  })

  it('should show an error banner and close the popup if the sell offer could not be revived', async () => {
    reviveSellOfferMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    const { result } = renderHook(useRepublishOffer)
    await result.current(contract)
    expect(showErrorBannerMock).toHaveBeenCalledWith('UNAUTHORIZED')
    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should show the offer republished popup', async () => {
    const { result } = renderHook(useRepublishOffer)
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'offer re-published',
      content: <OfferRepublished />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'go to offer',
        icon: 'arrowRightCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })

  it('should close the popup, save the contract and navigate to contract when the close is pressed', async () => {
    const { result } = renderHook(useRepublishOffer)
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })

  it('should close the popup, save the contract and navigate to search when the go to offer is pressed', async () => {
    const { result } = renderHook(useRepublishOffer)
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: 'newOfferId' })
  })
})
