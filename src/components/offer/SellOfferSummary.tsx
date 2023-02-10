import { NETWORK } from '@env'
import React, { ReactElement, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Icon from '../Icon'
import { PaymentMethod } from '../matches/PaymentMethod'
import { getPremiumColor } from '../matches/utils'
import { TabbedNavigation } from '../navigation/TabbedNavigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type SellOfferSummaryProps = ComponentProps & {
  offer: SellOffer | SellOfferDraft
}

const shouldShowRefundWallet = (offer: SellOffer | SellOfferDraft): boolean => !!offer.walletLabel
const isSellOfferWithDefinedEscrow = (offer: SellOffer | SellOfferDraft): offer is SellOffer & { escrow: string } =>
  'escrow' in offer && !!offer.escrow

export const SellOfferSummary = ({ offer, style }: SellOfferSummaryProps): ReactElement => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  return (
    <View style={[tw`border border-black-5 rounded-2xl p-7`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>
        {i18n(`offer.summary.${offer.tradeStatus !== 'offerCanceled' ? 'youAreSelling' : 'youWereSelling'}`)}
      </Text>
      <SatsFormat
        sats={offer.amount}
        containerStyle={tw`self-center`}
        bitcoinLogoStyle={tw`h-4 w-4 mr-1`}
        style={tw`subtitle-1 font-semibold`}
        satsStyle={tw`body-s font-normal`}
      />
      <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withA')}</Text>
      <Text style={[tw`text-center subtitle-1`, getPremiumColor(offer.premium, false)]}>
        <Text style={tw`subtitle-1`}>{Math.abs(offer.premium)}% </Text>
        {i18n(offer.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount')}
      </Text>
      <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`items-center mt-3 mb-2 flex-row justify-center`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p, i) => (
          <PaymentMethod
            key={`sellOfferMethod-${p}`}
            paymentMethodName={i18n(`paymentMethod.${p}`)}
            style={[i > 0 && tw`ml-1`]}
          />
        ))}
      </View>

      {shouldShowRefundWallet(offer) && (
        <>
          <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />
          <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.refundWallet')}</Text>
          <Text style={tw`self-center subtitle-1`}>{offer.walletLabel}</Text>
        </>
      )}

      {isSellOfferWithDefinedEscrow(offer) && (
        <>
          <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />
          <TouchableOpacity
            style={tw`flex-row items-end self-center`}
            onPress={() => showAddress(offer.escrow, NETWORK)}
          >
            <Text style={tw`underline tooltip text-black-2`}>{i18n('escrow.viewInExplorer')}</Text>
            <Icon
              id="externalLink"
              style={tw`w-[18px] h-[18px] ml-[2px] mb-[2px]`}
              color={tw`text-primary-main`.color}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
