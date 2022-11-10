import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { RouteProp } from '@react-navigation/native'
import { BigTitle, PeachScrollView } from '../../components'
import { account, updateTradingLimit } from '../../utils/account'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { getTradingLimit } from '../../utils/peachAPI'
import Rate from './components/Rate'

type Props = {
  route: RouteProp<{ params: RootStackParamList['tradeComplete'] }>
  navigation: StackNavigation
}
export default ({ route, navigation }: Props): ReactElement => {
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const [view, setView] = useState<'seller' | 'buyer' | ''>('')

  const saveAndUpdate = (contractData: Contract) => {
    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContract(() => route.params.contract)
    setView(() => (account.publicKey === route.params.contract.seller.id ? 'seller' : 'buyer'))
  }, [route])

  useEffect(() => {
    ;(async () => {
      const [tradingLimit] = await getTradingLimit({})

      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })()
    analytics().logEvent('trade_completed', {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    })
  }, [])

  return (
    <PeachScrollView style={tw`h-full flex pb-10 px-6`}>
      <View style={tw`flex-shrink flex justify-center`}>
        <BigTitle title={i18n(`tradeComplete.title.${view}.default`)} />
      </View>
      <Rate
        style={tw`flex flex-shrink pb-10`}
        contract={contract}
        view={view}
        navigation={navigation}
        saveAndUpdate={saveAndUpdate}
      />
    </PeachScrollView>
  )
}
