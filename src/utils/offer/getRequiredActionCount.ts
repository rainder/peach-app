import { getOffers } from './getOffers'
import { getOfferStatus } from './getOfferStatus'

/**
  * @description Method to sum up all required actions on current offers
  * @returns number of offers that require action
  */
export const getRequiredActionCount = (): number => getOffers().reduce((sum, offer) => {
  const { requiredAction } = getOfferStatus(offer)

  if (requiredAction) {
    console.log(requiredAction, offer.id, offer.online, offer.funding)
  }
  return requiredAction ? sum + 1 : sum
}, 0)