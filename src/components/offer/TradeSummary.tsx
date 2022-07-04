import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { isTradeCanceled, isTradeComplete } from '../../utils/offer/getOfferStatus'
import { OfferScreenNavigationProp } from '../../views/yourTrades/Offer'
import Card from '../Card'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { paymentDetailTemplates } from '../payment'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'


type TradeSummaryProps = ComponentProps & {
  contract: Contract
  view: 'seller' | 'buyer' | '',
  navigation: OfferScreenNavigationProp,
}

type PaymentMethodProps = {
  paymentMethod: PaymentMethod
}
const PaymentMethod = ({ paymentMethod }: PaymentMethodProps): ReactElement => <View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.on')}</Headline>
  <Selector
    items={[
      {
        value: paymentMethod,
        display: i18n(`paymentMethod.${paymentMethod}`).toLowerCase()
      }
    ]}
    style={tw`mt-2`}
  />
</View>

const Escrow = ({ contract }: TradeSummaryProps): ReactElement => <View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>
    {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
  </Headline>
  <Pressable style={tw`flex-row justify-center items-center`}
    onPress={() => contract.releaseTxId
      ? showTransaction(contract.releaseTxId as string, NETWORK)
      : showAddress(contract.escrow, NETWORK)
    }>
    <Text style={tw`text-grey-2 underline`}>
      {i18n('escrow.viewInExplorer')}
    </Text>
    <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
  </Pressable>
</View>

const OpenTradeSeller = ({ contract, navigation }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.buyer.id, user: contract.buyer })

  return <View>
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-2 normal-case`}>
        {i18n('buyer')}
      </Headline>
      <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
        Peach{contract.buyer.id.substring(0, 8)}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n('contract.willPayYou')}
      </Headline>
      <Text style={tw`text-center text-grey-2`}>
        {i18n(
          `currency.format.${contract.currency}`,
          contract.price.toFixed(2)
        )}
      </Text>
      {contract.paymentData && PaymentTo
        ? <PaymentTo paymentData={contract.paymentData}/>
        : null
      }
      <HorizontalLine style={tw`mt-4`}/>
      <PaymentMethod paymentMethod={contract.paymentMethod} />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Escrow contract={contract} view={''} navigation={navigation} />
        </View>
        : null
      }
    </View>
  </View>
}

const OpenTradeBuyer = ({ contract, navigation }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = () => navigation.navigate('profile', { userId: contract.seller.id, user: contract.seller })

  return <View style={tw`border border-peach-1 rounded`}>
    {contract.paymentMade
      ? <View style={tw`absolute top-0 left-0 w-full h-full z-20`} pointerEvents="none">
        <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
        <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
          {i18n('contract.payment.made')}
        </Text>
      </View>
      : null
    }
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-2 normal-case`}>
        {i18n('seller')}
      </Headline>
      <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
        Peach{contract.seller.id.substring(0, 8)}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n('contract.youShouldPay')}
      </Headline>
      <Text style={tw`text-center text-grey-2`}>
        {i18n(
          `currency.format.${contract.currency}`,
          contract.price.toFixed(2)
        )}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      {contract.paymentData && PaymentTo
        ? <PaymentTo paymentData={contract.paymentData}/>
        : null
      }
      <HorizontalLine style={tw`mt-4`}/>
      <PaymentMethod paymentMethod={contract.paymentMethod} />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Escrow contract={contract} view={''} navigation={navigation} />
        </View>
        : null
      }
    </View>
  </View>
}

const OpenTrade = ({ contract, view, navigation }: TradeSummaryProps): ReactElement =>
  view === 'seller'
    ? <OpenTradeSeller contract={contract} view={view} navigation={navigation} />
    : <OpenTradeBuyer contract={contract} view={view} navigation={navigation} />

// eslint-disable-next-line max-lines-per-function
const ClosedTrade = ({ contract, view, navigation }: TradeSummaryProps): ReactElement => {
  const ratingTradingPartner = view === 'seller' ? contract.ratingBuyer : contract.ratingSeller
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller
  const goToUserProfile = () => navigation.navigate('profile', { userId: tradingPartner.id, user: tradingPartner })
  return <View>
    <View style={tw`p-5`}>
      <Headline style={tw`text-grey-2 normal-case`}>
        {isTradeCanceled(contract)
          ? i18n(`contract.summary.${view === 'seller' ? 'youAreSelling' : 'youAreBuying'}`)
          : i18n(`contract.summary.${view === 'seller' ? 'youHaveSold' : 'youHaveBought'}`)
        }
      </Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.for')}</Headline>
      <Text style={tw`text-center`}>
        {i18n(`currency.format.${contract.currency}`, contract.price.toString())}
        <Text> ({contract.premium > 0 ? '+' : '-'}{Math.abs(contract.premium)}%)</Text>
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n(view === 'seller' ? 'contract.payment.to' : 'contract.summary.from')}
      </Headline>
      <View style={tw`flex-row justify-center items-center`}>
        <Text onPress={goToUserProfile}>
          Peach{tradingPartner.id.substring(0, 8)}
        </Text>
        {ratingTradingPartner === 1
          ? <Icon id="positive" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string}/>
          : ratingTradingPartner === -1
            ? <Icon id="negative" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string}/>
            : null
        }
      </View>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.in')}</Headline>
      <Selector items={[{ value: contract.currency, display: contract.currency }]}
        style={tw`mt-2`}/>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('contract.summary.via')}</Headline>
      <Selector
        items={[
          {
            value: contract.paymentMethod,
            display: i18n(`paymentMethod.${contract.paymentMethod}`).toLowerCase()
          }
        ]}
        style={tw`mt-2`}
      />

      {contract.escrow || contract.releaseTxId
        ? <View>
          <HorizontalLine style={tw`mt-4`}/>
          <Headline style={tw`text-grey-2 normal-case mt-4`}>
            {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
          </Headline>
          <Pressable style={tw`flex-row justify-center items-center`}
            onPress={() => contract.releaseTxId
              ? showTransaction(contract.releaseTxId as string, NETWORK)
              : showAddress(contract.escrow, NETWORK)
            }>
            <Text>
              {i18n('escrow.viewInExplorer')}
            </Text>
            <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color as string} />
          </Pressable>
        </View>
        : null
      }
    </View>
  </View>
}

export const TradeSummary = ({ contract, view, navigation, style }: TradeSummaryProps): ReactElement =>
  <Card style={style}>
    {!isTradeComplete(contract) && !isTradeCanceled(contract)
      ? <OpenTrade contract={contract} view={view} navigation={navigation} />
      : <ClosedTrade contract={contract} view={view} navigation={navigation} />
    }
  </Card>