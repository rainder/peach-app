import { TouchableOpacity, View } from 'react-native'
import { Match } from '../../../peach-api/src/@types/match'
import { horizontalBadgePadding } from '../../components/Badge'
import { PeachScrollView } from '../../components/PeachScrollView'
import { PeachyBackground } from '../../components/PeachyBackground'
import { Screen } from '../../components/Screen'
import { BTCAmount } from '../../components/bitcoin/btcAmount/BTCAmount'
import { Badges } from '../../components/matches/components/Badges'
import { PeachText } from '../../components/text/PeachText'
import { PriceFormat } from '../../components/text/PriceFormat'
import { useBitcoinPrices, useCancelOffer, useNavigation } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useRoute } from '../../hooks/useRoute'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isSellOffer } from '../../utils/offer/isSellOffer'
import { LoadingScreen } from '../loading/LoadingScreen'
import { BuyBitcoinHeader } from '../offerPreferences/components/BuyBitcoinHeader'
import { MarketInfo } from '../offerPreferences/components/MarketInfo'
import { useOfferMatches } from '../search/hooks'
import { useSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { Rating } from '../settings/profile/profileOverview/components'

export function Explore () {
  const { offerId } = useRoute<'explore'>().params
  const { allMatches: matches, isLoading } = useOfferMatches(offerId)
  const hasMatches = matches.length > 0
  if (isLoading) return <LoadingScreen />
  return (
    <Screen header={<ExploreHeader />}>
      {hasMatches ? (
        <PeachScrollView contentStyle={tw`gap-10px`}>
          <BuyOfferMarketInfo />
          <OfferSummaryCards />
        </PeachScrollView>
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <BuyOfferMarketInfo />
          <PeachText style={tw`text-center subtitle-2`}>{i18n('search.weWillNotifyYou')}</PeachText>
        </View>
      )}
    </Screen>
  )
}

function BuyOfferMarketInfo () {
  const { offerId } = useRoute<'explore'>().params
  const { offer } = useOfferDetails(offerId)

  if (offer && isSellOffer(offer)) {
    throw new Error('Offer should be a buy offer')
  }

  return (
    <MarketInfo
      type={'sellOffers'}
      meansOfPayment={offer?.meansOfPayment}
      maxPremium={offer?.maxPremium || undefined}
      minReputation={offer?.minReputation || undefined}
      buyAmountRange={offer?.amount}
    />
  )
}

function OfferSummaryCards () {
  const { offerId } = useRoute<'explore'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  return (
    <>
      {matches.map((match, index) => (
        <ExploreCard key={match.offerId} match={matches[index]} />
      ))}
    </>
  )
}

function ExploreCard ({ match }: { match: Match }) {
  const { matched, amount, user, premium, instantTrade } = match
  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount)
  const { offerId } = useRoute<'explore'>().params
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('matchDetails', { matchId: match.offerId, offerId })
  }

  return (
    <TouchableOpacity
      style={[
        tw`justify-center overflow-hidden border bg-primary-background-light rounded-2xl border-primary-main`,
        matched && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {instantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <PeachText style={tw`text-center py-2px subtitle-2 text-primary-background-light`}>instant trade</PeachText>
        </View>
      )}
      <View style={tw`justify-center py-2 px-9px`}>
        <View style={[tw`flex-row items-center justify-between`, { paddingLeft: horizontalBadgePadding }]}>
          <Rating rating={user.rating} />
          <BTCAmount amount={amount} size="small" />
        </View>
        <View style={tw`flex-row items-center justify-between`}>
          <Badges id={user.id} unlockedBadges={user.medals} />
          <PeachText style={tw`text-center`}>
            <PriceFormat style={tw`tooltip`} currency={displayCurrency} amount={fiatPrice * (1 + premium / 100)} />
            <PeachText style={tw`text-black-2`}>
              {' '}
              ({premium >= 0 ? '+' : ''}
              {premium}%)
            </PeachText>
          </PeachText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function ExploreHeader () {
  const { offerId } = useRoute<'explore'>().params
  const showSortAndFilterPopup = useSortAndFilterPopup(offerId)
  const navigation = useNavigation()
  const goToPreferences = () => {
    navigation.navigate('editBuyPreferences', { offerId })
  }
  const cancelOffer = useCancelOffer(offerId)

  return (
    <BuyBitcoinHeader
      icons={[
        { ...headerIcons.buyFilter, onPress: showSortAndFilterPopup },
        { ...headerIcons.buyPreferences, onPress: goToPreferences },
        { ...headerIcons.cancel, onPress: cancelOffer },
      ]}
    />
  )
}
