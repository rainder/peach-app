import { tradeSummaryStore } from '../../store/tradeSummaryStore'

const statusWithRequiredAction = [
  'fundEscrow',
  'hasMatchesAvailable',
  'refundTxSignatureRequired',
  'dispute',
  'rateUser',
  'confirmCancelation',
]
const statusWithRequiredActionForBuyer = ['paymentRequired']
const statusWithRequiredActionForSeller = ['confirmPaymentRequired']

/**
 * @description Method to sum up all required actions on current offers
 * @returns number of offers that require action
 */
export const getRequiredActionCount = (): number =>
  tradeSummaryStore.getState().offers.reduce((sum, offer) => {
    const requiredAction
      = statusWithRequiredAction.includes(offer.tradeStatus)
      || (offer.type === 'bid' && statusWithRequiredActionForBuyer.includes(offer.tradeStatus))
      || (offer.type === 'ask' && statusWithRequiredActionForSeller.includes(offer.tradeStatus))

    return requiredAction ? sum + 1 : sum
  }, 0)
