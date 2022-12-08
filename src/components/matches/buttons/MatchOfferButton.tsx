import React from 'react'
import i18n from '../../../utils/i18n'
import Button from '../../Button'
import { useOfferMatches } from '../../../views/search/hooks/useOfferMatches'
import { useMatchStore } from '../store'
import { useMatchOffer } from '../hooks'
import { useRoute } from '../../../hooks'

export const MatchOfferButton = () => {
  const { offer } = useRoute<'search'>().params

  const { allMatches: matches } = useOfferMatches()
  const currentIndex = useMatchStore((state) => state.currentIndex)
  const currentMatch = matches[currentIndex]

  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)

  return (
    <Button
      title={i18n(
        `search.${offer.type === 'bid' ? (currentMatch.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`,
      )}
      wide={false}
      disabled={currentMatch.matched || isLoading}
      loading={isLoading}
      onPress={matchOffer}
    />
  )
}
