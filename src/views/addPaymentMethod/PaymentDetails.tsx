import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { CommonActions, RouteProp } from '@react-navigation/native'
import { Headline } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { StackNavigation } from '../../utils/navigation'
import { addPaymentData } from '../../utils/account'

type Props = {
  route: RouteProp<{ params: RootStackParamList['paymentDetails'] }>,
  navigation: StackNavigation,
}

const previousScreen: Record<keyof RootStackParamList, keyof RootStackParamList> = {
  'buyPreferences': 'buy',
  'sellPreferences': 'sell',
  'paymentMethods': 'settings',
}

export default ({ route, navigation }: Props): ReactElement => {
  const [paymentData, setPaymentData] = useState(route.params.paymentData)
  const { type: paymentMethod } = paymentData

  const goToOrigin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'home' },
          { name: previousScreen[route.params.origin[0]] as string || 'home' },
          {
            name: route.params.origin[0] as string,
            params: route.params.origin[1],
          },
        ],
      })
    )
  }
  const onSubmit = (d: PaymentData) => {
    addPaymentData(d)
    goToOrigin()
  }

  const onDelete = () => {
    goToOrigin()
  }

  return <View style={tw`flex h-full pt-7 pb-10`}>
    <Headline>
      {i18n(
        'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`)
      )}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center mt-8 px-6`}>
      <PaymentMethodForm paymentMethod={paymentMethod}
        style={tw`h-full flex-shrink flex-col justify-between`}
        currencies={paymentData.currencies}
        data={paymentData}
        onSubmit={onSubmit}
        onDelete={onDelete}
        navigation={navigation}
      />
    </View>
  </View>
}