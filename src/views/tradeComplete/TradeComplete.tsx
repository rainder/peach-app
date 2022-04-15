import React, { ReactElement } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { RouteProp } from '@react-navigation/native'
import { BigTitle, Button } from '../../components'
import i18n from '../../utils/i18n'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'tradeComplete'>

type Props = {
  route: RouteProp<{ params: {
    view: 'buyer' | 'seller',
  } }>,
  navigation: ProfileScreenNavigationProp,
}
export default ({ route, navigation }: Props): ReactElement => <View style={tw`pb-24 px-6 h-full flex`}>
  <View style={tw`h-full flex-shrink flex justify-center`}>
    <BigTitle title={i18n(`tradeComplete.title.${route.params.view}.default`)}/>
  </View>
  <View style={tw`flex items-center`}>
    <Button
      title={i18n('goBackHome')}
      secondary={true}
      wide={false}
      onPress={() => navigation.navigate('home', {})}
    />
  </View>
</View>