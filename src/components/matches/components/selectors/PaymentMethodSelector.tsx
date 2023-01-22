import React from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { isBuyOffer } from '../../../../utils/offer'
import { HorizontalLine } from '../../../ui'
import { MatchStore, useMatchStore } from '../../store'
import { CustomSelector } from './CustomSelector'
import { PaymentMethodSelectorText } from './PaymentMethodSelectorText'
import { PulsingText } from './PulsingText'

const storeSelector = (matchId: Match['offerId']) => (state: MatchStore) => ({
  offer: state.offer,
  selectedValue: state.matchSelectors[matchId]?.selectedPaymentMethod,
  selectedCurrency: state.matchSelectors[matchId]?.selectedCurrency,
  setSelectedPaymentMethod: state.setSelectedPaymentMethod,
  availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
  showPaymentMethodPulse: state.matchSelectors[matchId]?.showPaymentMethodPulse || false,
  setShowCurrencyPulse: state.setShowCurrencyPulse,
})

export const PaymentMethodSelector = ({ matchId }: { matchId: Match['offerId'] }) => {
  const {
    offer,
    selectedValue,
    selectedCurrency,
    setSelectedPaymentMethod,
    availablePaymentMethods,
    showPaymentMethodPulse,
    setShowCurrencyPulse,
  } = useMatchStore(storeSelector(matchId), shallow)

  const disabled = !selectedCurrency
  const onChange = (paymentMethod: PaymentMethod) => {
    if (disabled) {
      setShowCurrencyPulse(matchId)
    } else {
      setSelectedPaymentMethod(paymentMethod, matchId)
    }
  }

  const isVerified = false
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: <PaymentMethodSelectorText isSelected={p === selectedValue} isVerified={isVerified} name={p} />,
  }))

  return (
    <>
      <HorizontalLine style={tw`mb-4 bg-black-5`} />
      <View style={disabled && !showPaymentMethodPulse && tw`opacity-30`}>
        <PulsingText style={tw`self-center mb-1`} showPulse={showPaymentMethodPulse}>
          {i18n(isBuyOffer(offer) ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}
        </PulsingText>
        <CustomSelector style={tw`self-center mb-6`} {...{ selectedValue, items, onChange }} />
      </View>
    </>
  )
}
