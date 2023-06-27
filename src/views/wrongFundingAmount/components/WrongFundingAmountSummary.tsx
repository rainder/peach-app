import { View } from 'react-native'
import { Text } from '../../../components'
import { TradeSeparator } from '../../../components/offer/TradeSeparator'
import i18n from '../../../utils/i18n'
import tw from '../../../styles/tailwind'
import { LabelAndAmount } from './LabelAndAmount'
import { thousands } from '../../../utils/string'
import { sum } from '../../../utils/math'

type Props = {
  sellOffer?: SellOffer
}
export const WrongFundingAmountSummary = ({ sellOffer }: Props) => {
  const actualAmount = sellOffer?.amount || 0
  const fundingAmount = sellOffer?.funding.amounts.reduce(sum, 0) || 0
  return (
    <View style={tw`gap-3`}>
      <TradeSeparator iconId="download" text={i18n('offer.requiredAction.fundingAmountDifferent')} />
      <View style={tw`gap-1`}>
        <LabelAndAmount label={i18n('escrow.funded')} amount={actualAmount} />
        <LabelAndAmount label={i18n('amount')} amount={fundingAmount} />
      </View>
      <Text style={tw`body-s`}>
        {i18n('escrow.wrongFundingAmount.description', thousands(actualAmount), thousands(fundingAmount))}
      </Text>
      <Text style={tw`body-s`}>{i18n('escrow.wrongFundingAmount.continueOrRefund', thousands(actualAmount))}</Text>
    </View>
  )
}
