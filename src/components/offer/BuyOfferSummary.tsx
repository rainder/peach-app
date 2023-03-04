import React, { ReactElement, useMemo, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { TabbedNavigation } from '../navigation/TabbedNavigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useSettingsStore } from '../../store/settingsStore'
import shallow from 'zustand/shallow'

type BuyOfferSummaryProps = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}

export const BuyOfferSummary = ({ offer, style }: BuyOfferSummaryProps): ReactElement => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const isPeachWallet = useMemo(() => !!peachWallet.findKeyPairByAddress(offer.releaseAddress), [offer.releaseAddress])
  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const walletLabel = useMemo(() => {
    if (offer.walletLabel) {
      return offer.walletLabel
    }
    if (isPeachWallet) {
      return i18n('peachWallet')
    }
    if (payoutAddress === offer.releaseAddress) {
      return payoutAddressLabel || i18n('offer.summary.customPayoutAddress')
    }
    return i18n('offer.summary.customPayoutAddress')
  }, [isPeachWallet, offer.releaseAddress, offer.walletLabel, payoutAddress, payoutAddressLabel])

  return (
    <View style={[tw`w-full border border-black-5 rounded-2xl p-7`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.youAreBuying')}</Text>

      <SatsFormat
        sats={offer.amount[0]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`font-normal body-s`}
      />
      <Text style={tw`self-center text-black-2`}>&</Text>
      <SatsFormat
        sats={offer.amount[1]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`font-normal body-s`}
      />

      <HorizontalLine style={tw`w-64 my-4`} />

      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`flex-row flex-wrap items-center justify-center mt-3 mb-2`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
      <HorizontalLine style={tw`w-64 my-4`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('to')}</Text>
      <Text style={tw`self-center subtitle-1`}>{walletLabel}</Text>
    </View>
  )
}
