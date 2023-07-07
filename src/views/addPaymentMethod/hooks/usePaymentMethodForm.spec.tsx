import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { usePaymentMethodFormSetup } from './usePaymentMethodFormSetup'

const useRouteMock = jest.fn(() => ({
  params: {
    origin: 'paymentMethod',
    paymentData: {
      id: '1',
      type: 'revolut',
      name: 'Revolut',
      currencies: ['EUR'],
      origin: 'paymentMethod',
    },
  },
}))

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const goToOriginMock = jest.fn()
jest.mock('../../../hooks/useGoToOrigin', () => ({
  useGoToOrigin: jest.fn(() => goToOriginMock),
}))

const wrapper = NavigationWrapper

describe('usePaymentMethodFormSetup', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return paymentMethod, onSubmit, currencies, data', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    expect(result.current).toEqual({
      onSubmit: expect.any(Function),
      data: {
        id: '1',
        type: 'revolut',
        name: 'Revolut',
        currencies: ['EUR'],
        origin: 'paymentMethod',
      },
    })
  })
  it('should set the header', () => {
    renderHook(usePaymentMethodFormSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set the header if no id is present and the paymentMethod is not revolut', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        origin: 'paymentMethod',
        // @ts-expect-error
        paymentData: {
          type: 'sepa',
          name: 'SEPA',
          currencies: ['EUR'],
          origin: 'paymentMethod',
        },
      },
    })
    renderHook(usePaymentMethodFormSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show the delete PM popup when the delete icon is pressed', () => {
    renderHook(usePaymentMethodFormSetup, { wrapper })

    headerState.header().props.icons?.[1].onPress()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: i18n('help.paymentMethodDelete.title'),
      content: expect.any(Object),
      visible: true,
      level: 'ERROR',
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: expect.any(Function),
        icon: 'trash',
        label: i18n('delete'),
      },
    })
    expect(usePopupStore.getState().content).toMatchInlineSnapshot('<DeletePaymentMethodConfirm />')
  })
  it('should add the payment method when the form is submitted', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    const paymentMethod = {
      id: '1',
      label: 'Revolut',
      type: 'revolut',
      currencies: ['EUR'],
    } satisfies PaymentData
    act(() => {
      result.current.onSubmit(paymentMethod)
    })
    expect(account.paymentData).toContainEqual(paymentMethod)
  })
  it('should automatically select the payment method', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    useOfferPreferences.setState({ preferredPaymentMethods: {} })
    const paymentMethod = {
      id: '1',
      label: 'Revolut',
      type: 'revolut',
      currencies: ['EUR'],
    } satisfies PaymentData
    act(() => {
      result.current.onSubmit(paymentMethod)
    })
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({ revolut: '1' })
  })
  it('should go to the origin when the form is submitted', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    act(() => {
      result.current.onSubmit({ id: '1', label: 'Revolut', type: 'revolut', currencies: ['EUR'] })
    })
    expect(goToOriginMock).toHaveBeenCalledWith('paymentMethod')
  })
})
