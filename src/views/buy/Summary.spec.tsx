import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import Summary from './Summary'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

const releaseAddress = 'releaseAddress'
const walletLabel = 'walletLabel'
const message = 'message'
const messageSignature = 'messageSignature'
const goToMessageSigning = jest.fn()
const publishOffer = jest.fn()

const defaultBuySummary = {
  releaseAddress,
  walletLabel,
  message,
  messageSignature,
  goToMessageSigning,
  canPublish: true,
  publishOffer,
  isPublishing: false,
}
const useBuySummarySetupMock = jest.fn().mockReturnValue(defaultBuySummary)
jest.mock('./hooks/useBuySummarySetup', () => ({
  useBuySummarySetup: (...args: any[]) => useBuySummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2023-03-01T13:39:55.942Z') })

describe('Summary', () => {
  const offerDraft: BuyOfferDraft = {
    creationDate: new Date(),
    type: 'bid',
    amount: [100000, 1000000],
    releaseAddress,
    paymentData: buyOffer.paymentData,
    meansOfPayment: buyOffer.meansOfPayment,
    originalPaymentData: buyOffer.originalPaymentData,
  }
  const setOfferDraft = jest.fn()
  const next = jest.fn()
  const renderer = createRenderer()

  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the Summary view', () => {
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly while peach wallet is still signing message', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: true,
      canPublish: false,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly with custom payout wallet and signature is still missing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly when publishing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      isPublishing: true,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('clicking on "publish" publishes offer', () => {
    const { getByText } = render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    fireEvent(getByText('publish'), 'onPress')
    expect(publishOffer).toHaveBeenCalled()
  })
  it('clicking on "next" navigates to message signing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    const { getByText } = render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    fireEvent(getByText('next'), 'onPress')
    expect(goToMessageSigning).toHaveBeenCalled()
  })
})
