import React from 'react'
import { SatsFormat, Text } from '../../../components'
import { useMatchStore } from '../../../components/matches/store'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const MatchInformation = () => {
  const { amount } = useMatchStore((state) => state.offer)
  const { allMatches: matches } = useOfferMatches()
  return (
    <>
      <Text style={tw`text-center h4`}>{i18n(`search.youGot${matches.length === 1 ? 'AMatch' : 'Matches'}`)}</Text>
      <Text style={tw`text-center body-l text-black-2`}>{i18n('search.sellOffer')}:</Text>
      {typeof amount === 'number' && (
        <SatsFormat
          containerStyle={tw`items-center self-center`}
          sats={amount}
          color={tw`text-grey-2`}
          style={tw`leading-loose body-l`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-1`}
          satsStyle={tw`subtitle-1`}
        />
      )}
    </>
  )
}
