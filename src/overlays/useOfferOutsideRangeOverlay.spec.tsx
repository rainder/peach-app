import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useOfferOutsideRangeOverlay } from './useOfferOutsideRangeOverlay'
import { OfferOutsideRange } from './OfferOutsideRange'

const wrapper = NavigationWrapper

describe('useOfferOutsideRangeOverlay', () => {
  const offerId = '37'
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
    jest.resetAllMocks()
  })

  it('opens BuyOfferExpired overlay', () => {
    const { result } = renderHook(useOfferOutsideRangeOverlay, { wrapper })
    act(() => {
      result.current(offerId)
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'bitcoin pumped!',
      content: <OfferOutsideRange {...{ offerId }} />,
      visible: true,
      level: 'APP',
      action2: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action1: {
        label: 'go to offer',
        icon: 'arrowLeftCircle',
        callback: expect.any(Function),
      },
    })
  })
  it('closes overlay', () => {
    const { result } = renderHook(useOfferOutsideRangeOverlay, { wrapper })
    act(() => {
      result.current(offerId)
    })

    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('navigates to offer', () => {
    const { result } = renderHook(useOfferOutsideRangeOverlay, { wrapper })
    act(() => {
      result.current(offerId)
    })
    usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(navigateMock).toHaveBeenCalledWith('offer', { offerId })
  })
})
