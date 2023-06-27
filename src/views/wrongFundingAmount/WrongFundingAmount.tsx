import { View } from 'react-native'
import { Text } from '../../components'
import { useWrongFundingAmountSetup } from './hooks/useWrongFundingAmountSetup'
import { TradeSeparator } from '../../components/offer/TradeSeparator'
import i18n from '../../utils/i18n'
import tw from '../../styles/tailwind'
import { RefundEscrowSlider } from '../../components/offer'
import { ContinueTradeSlider } from './components/ContinueTradeSlider'
import { LabelAndAmount } from './components/LabelAndAmount'
import { thousands } from '../../utils/string'

export const WrongFundingAmount = () => {
  const { sellOffer, fundingAmount, actualAmount } = useWrongFundingAmountSetup()

  return (
    <View style={tw`justify-between flex-grow px-6 pt-5 pb-3`}>
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
      <View style={tw`items-center gap-3`}>
        <ContinueTradeSlider sellOffer={sellOffer} />
        <RefundEscrowSlider sellOffer={sellOffer} />
      </View>
    </View>
  )
}
