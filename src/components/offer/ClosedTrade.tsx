import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { UserInfo } from '../matches/components'
import { PaymentMethod } from '../matches/PaymentMethod'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { TradeSummaryProps } from './TradeSummary'

const CompletedTradeDetails = ({
  currency,
  price,
  amount,
  paymentMethod,
  isBuyer,
  paymentData,
  premium,
}: Contract & { isBuyer: boolean }) => {
  const paymentMethodLabel = useMemo(
    () => (paymentData ? getPaymentDataByMethod(paymentMethod, hashPaymentData(paymentData))?.label : null),
    [paymentData, paymentMethod],
  )
  const bitcoinPrice = round(((price - premium) / amount) * 100000000, 2)
  return (
    <View>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-black-2`}>{i18n(`contract.summary.${isBuyer ? 'youPaid' : 'hasPaidYou'}`)}</Text>
        <Text style={tw`subtitle-1`}>
          {currency} {price.toLocaleString()}
        </Text>
      </View>

      <View style={tw`flex-row justify-between my-3`}>
        <Text style={tw`text-black-2`}>{i18n('contract.summary.for')}</Text>
        <SatsFormat sats={amount} style={tw`subtitle-1`} bitcoinLogoStyle={tw`w-4 h-4 mr-1`} satsStyle={tw`body-s`} />
      </View>

      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-black-2`}>{i18n(`contract.summary.${isBuyer ? 'via' : 'to'}`)}</Text>
        {isBuyer || !paymentMethodLabel ? (
          <PaymentMethod paymentMethodName={paymentMethod} />
        ) : (
          <Text style={tw`subtitle-1`}>{paymentMethodLabel}</Text>
        )}
      </View>

      {!isBuyer && (
        <View style={tw`flex-row justify-between mt-3`}>
          <Text style={tw`text-black-2`}>{i18n('contract.summary.btcPrice')}</Text>
          <Text style={tw`subtitle-1`}>
            {currency} {bitcoinPrice.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  )
}

const CanceledTradeDetails = ({ amount, style }: Contract & ComponentProps) => (
  <SatsFormat
    sats={amount}
    style={tw`subtitle-1`}
    containerStyle={style}
    bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
    satsStyle={tw`body-s`}
  />
)

export const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller

  return (
    <View>
      <UserInfo user={tradingPartner} />

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      {contract.tradeStatus === 'tradeCanceled' ? (
        <CanceledTradeDetails {...contract} style={tw`self-center`} />
      ) : (
        <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
      )}

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      <Escrow contract={contract} />
    </View>
  )
}
