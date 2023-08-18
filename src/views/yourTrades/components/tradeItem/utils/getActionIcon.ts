import { isContractSummary, isPastOffer, statusIcons } from '../../../utils'

export const getActionIcon = (tradeSummary: Pick<TradeSummary, 'tradeStatus'>, isWaiting: boolean) => {
  if (isPastOffer(tradeSummary.tradeStatus)) {
    return undefined
  }
  if (isContractSummary(tradeSummary) && tradeSummary.disputeWinner) {
    return 'alertOctagon'
  }

  if (tradeSummary.tradeStatus === 'payoutPending') return statusIcons.payoutPending

  return statusIcons[isWaiting ? 'waiting' : tradeSummary.tradeStatus]
}
