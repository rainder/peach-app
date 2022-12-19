import React from 'react'
import Refund from '../../../overlays/Refund'
import { getContract } from '../../../utils/contract'
import { StackNavigation } from '../../../utils/navigation'
import { getNavigationDestination } from './getNavigationDestination'
import { shouldOpenRefundOverlay } from './shouldOpenRefundOverlay'

type NavigateToOfferProps = {
  offer: SellOffer | BuyOffer
  status: TradeStatus['status']
  requiredAction: TradeStatus['requiredAction']
  navigation: StackNavigation
  updateOverlay: React.Dispatch<OverlayState>
  matchStoreSetOffer: (offer: BuyOffer | SellOffer) => void
}

export const navigateToOffer = ({
  offer,
  navigation,
  updateOverlay,
  matchStoreSetOffer,
  ...offerStatus
}: NavigateToOfferProps): void => {
  const contract = offer.contractId ? getContract(offer.contractId) : null
  const navigationDestination = getNavigationDestination(offer, offerStatus, contract)
  if (shouldOpenRefundOverlay(offer, offerStatus, contract)) {
    updateOverlay({
      content: <Refund {...{ sellOffer: offer, navigation }} />,
      showCloseButton: false,
    })
  }
  if (navigationDestination[0] === 'search') {
    matchStoreSetOffer(offer)
  }

  return navigation.navigate(...navigationDestination)
}
