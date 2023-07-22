import { useCallback } from 'react'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { BuyFilterAndSort, SellSorters } from '../../../popups/filtersAndSorting'
import { usePopupStore } from '../../../store/usePopupStore'
import { isBuyOffer } from '../../../utils/offer'

export const useSortAndFilterPopup = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    if (!offer) return
    setPopup(<SortAndFilterPopup offer={offer} />)
  }, [offer, setPopup])

  return showPopup
}

type Props = {
  offer: BuyOffer | SellOffer
}

function SortAndFilterPopup ({ offer }: Props) {
  return isBuyOffer(offer) ? <BuyFilterAndSort offer={offer} /> : <SellSorters />
}
