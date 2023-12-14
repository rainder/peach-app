import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Button } from '../../components/buttons/Button'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { interpolate } from '../../utils/math/interpolate'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { AmountSelectorComponent } from './components/AmountSelectorComponent'
import { FilterContainer } from './components/FilterContainer'
import { MarketInfo } from './components/MarketInfo'
import { MaxPremiumFilterComponent } from './components/MaxPremiumFilterComponent'
import { ReputationFilterComponent } from './components/MinReputationFilter'
import { PreferenceMethods } from './components/PreferenceMethods'
import { PreferenceScreen } from './components/PreferenceScreen'
import { usePublishOffer } from './utils/usePublishOffer'
import { useRestrictSatsAmount } from './utils/useRestrictSatsAmount'
import { useTradingAmountLimits } from './utils/useTradingAmountLimits'

export function BuyOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)

  return (
    <PreferenceScreen isSliding={isSliding} button={<ShowOffersButton />}>
      <PreferenceMarketInfo />
      <PreferenceMethods type="buy" />
      <AmountSelector setIsSliding={setIsSliding} />
      <Filters />
    </PreferenceScreen>
  )
}

function PreferenceMarketInfo () {
  const offerPreferenes = useOfferPreferences(
    (state) => ({
      buyAmountRange: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium
        ? state.filter.buyOffer.maxPremium || undefined
        : undefined,
      minReputation: state.filter.buyOffer.shouldApplyMinReputation
        ? interpolate(state.filter.buyOffer.minReputation || 0, [0, 5], [-1, 1])
        : undefined,
    }),
    shallow,
  )
  return <MarketInfo type="sellOffers" {...offerPreferenes} />
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const [buyAmountRange, setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )

  return <AmountSelectorComponent setIsSliding={setIsSliding} range={buyAmountRange} setRange={setBuyAmountRange} />
}

function Filters () {
  return (
    <FilterContainer
      filters={
        <>
          <MaxPremiumFilter />
          <ReputationFilter />
        </>
      }
    />
  )
}

function ReputationFilter () {
  const [minReputation, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.minReputation, state.toggleMinReputationFilter],
    shallow,
  )
  return <ReputationFilterComponent minReputation={minReputation} toggle={toggle} />
}

function MaxPremiumFilter () {
  const [maxPremium, setMaxPremium] = useOfferPreferences(
    (state) => [state.filter.buyOffer.maxPremium, state.setMaxPremiumFilter],
    shallow,
  )
  const [shouldApplyFilter, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.shouldApplyMaxPremium, state.toggleShouldApplyMaxPremium],
    shallow,
  )

  return (
    <MaxPremiumFilterComponent
      maxPremium={maxPremium}
      setMaxPremium={setMaxPremium}
      shouldApplyFilter={shouldApplyFilter}
      toggleShouldApplyFilter={toggle}
    />
  )
}

function ShowOffersButton () {
  const [peachWalletActive, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddressLabel],
    shallow,
  )
  const buyOfferPreferences = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
    }),
    shallow,
  )
  const filter = useOfferPreferences((state) => state.filter.buyOffer)
  const maxPremium = filter.shouldApplyMaxPremium ? filter.maxPremium : null
  const minReputation = filter.shouldApplyMinReputation ? interpolate(filter.minReputation || 0, [0, 5], [-1, 1]) : null

  const offerDraft = {
    type: 'bid' as const,
    releaseAddress: '',
    ...buyOfferPreferences,
    maxPremium,
    minReputation,
    walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel,
  }

  const originalPaymentData = useOfferPreferences((state) => state.originalPaymentData)
  const methodsAreValid = originalPaymentData.every(isValidPaymentData)
  const [minAmount, maxAmount] = useTradingAmountLimits('buy')
  const restrictAmount = useRestrictSatsAmount('buy')
  const setBuyAmountRange = useOfferPreferences((state) => state.setBuyAmountRange)
  const rangeIsWithinLimits = buyOfferPreferences.amount[0] >= minAmount && buyOfferPreferences.amount[1] <= maxAmount
  if (!rangeIsWithinLimits) {
    setBuyAmountRange([restrictAmount(buyOfferPreferences.amount[0]), restrictAmount(buyOfferPreferences.amount[1])])
  }
  const rangeIsValid = rangeIsWithinLimits && offerDraft.amount[0] <= offerDraft.amount[1]
  const formValid = methodsAreValid && rangeIsValid
  const { mutate: publishOffer, isLoading: isPublishing } = usePublishOffer(offerDraft)

  const onPress = () => {
    publishOffer()
  }
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid}
      loading={isPublishing}
    >
      Show Offers
    </Button>
  )
}
