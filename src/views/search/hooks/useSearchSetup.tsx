import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { useMessageContext } from '../../../contexts/message'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isBuyOffer, isSellOffer, offerIdToHex } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { shouldGoToContract } from '../helpers/shouldGoToContract'
import { useOfferMatches } from './useOfferMatches'
import { useRefetchOnNotification } from './useRefetchOnNotification'
import { useSortAndFilterPopup } from './useSortAndFilterPopup'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches(offerId)

  const [, updateMessage] = useMessageContext()
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)

  useSearchHeaderSetup()

  useEffect(() => {
    if (offer?.meansOfPayment) addMatchSelectors(matches, offer.meansOfPayment)
  }, [addMatchSelectors, matches, offer?.meansOfPayment])

  useEffect(
    () => () => {
      resetStore()
    },
    [resetStore],
  )

  useEffect(() => {
    if (error) {
      const errorMessage = parseError(error?.error)
      if (errorMessage === 'CANCELED' || errorMessage === 'CONTRACT_EXISTS') {
        if (shouldGoToContract(error)) navigation.replace('contract', { contractId: error.details.contractId })
        return
      }
      if (errorMessage !== 'UNAUTHORIZED') {
        updateMessage({ msgKey: errorMessage, level: 'ERROR' })
      }
    }
  }, [error, navigation, offerId, updateMessage])

  useRefetchOnNotification(refetch)

  return { offer, hasMatches: !!matches.length }
}

function useSearchHeaderSetup () {
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)

  const navigation = useNavigation()
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')
  const showSortAndFilterPopup = useSortAndFilterPopup(offerId)

  const cancelOffer = useCancelOffer(offer)
  const goToEditPremium = () => navigation.navigate('editPremium', { offerId })
  const getHeaderIcons = () => {
    if (!offer) return undefined
    const filterIcon = isBuyOffer(offer) ? headerIcons.buyFilter : headerIcons.sellFilter
    const icons = [{ ...filterIcon, onPress: showSortAndFilterPopup }]

    if (isSellOffer(offer)) icons.push({ ...headerIcons.percent, onPress: goToEditPremium })

    icons.push({ ...headerIcons.cancel, onPress: cancelOffer })

    if (offer.matches.length > 0) {
      icons.push({ ...headerIcons.help, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup })
    }
    return icons
  }
  useHeaderSetup({
    title: offerIdToHex(offerId),
    icons: getHeaderIcons(),
  })
}
