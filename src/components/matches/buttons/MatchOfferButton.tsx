import React from 'react'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'
import { useMatchOffer } from '../hooks'
import { useRoute } from '../../../hooks'
import { PrimaryButton } from '../../buttons'
import { isBuyOffer } from '../../../utils/offer'

export const MatchOfferButton = () => {
  const { offer } = useRoute<'search'>().params

  const { allMatches: matches } = useOfferMatches()
  const currentIndex = useMatchStore((state) => state.currentIndex)
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  return (
    <PrimaryButton narrow disabled={currentMatch.matched || isLoading} loading={isLoading} onPress={() => matchOffer()}>
      {i18n(`search.${isBuyOffer(offer) ? (currentMatch.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`)}
    </PrimaryButton>
  )
}
