import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../../components'
import { Currencies } from './Currencies'
import { Other } from './Other'
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { useOfferPreferences } from '../../store/offerPreferenes'

const CurrencyTab = createMaterialTopTabNavigator()

type Props = {
  currency?: Currency
  setCurrency: (c: Currency) => void
}

const TabBar = (props: MaterialTopTabBarProps) => {
  const selected = props.state.routes[props.state.index].name
  const items = props.state.routes
  const select = props.navigation.navigate
  const colors = {
    text: tw`text-black-2`,
    textSelected: tw`text-black-1`,
    underline: tw`bg-black-1`,
  }

  return (
    <View style={[tw`flex-row justify-center`]}>
      {items.map((item) => (
        <TouchableOpacity style={tw`flex-shrink px-2`} key={item.key + item.name} onPress={() => select(item)}>
          <Text
            style={[tw`px-4 py-2 text-center input-label`, item.name === selected ? colors.textSelected : colors.text]}
          >
            {item.name}
          </Text>
          {item.name === selected && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
        </TouchableOpacity>
      ))}
    </View>
  )
}

export const CurrencyTabs = ({ currency = 'EUR', setCurrency }: Props) => {
  const preferredCurrencyType = useOfferPreferences((state) => state.preferredCurrenyType)
  const setPreferredCurrencyType = useOfferPreferences((state) => state.setPreferredCurrencyType)
  return (
    <CurrencyTab.Navigator
      initialRouteName={preferredCurrencyType}
      screenListeners={{
        focus: (e) => {
          const name = e.target?.split('-')[0] as 'Europe' | 'other'
          setPreferredCurrencyType(name)
        },
      }}
      tabBar={TabBar}
    >
      <CurrencyTab.Screen name="Europe" children={() => <Currencies {...{ currency, setCurrency }} />} />
      <CurrencyTab.Screen name="other" children={() => <Other {...{ currency, setCurrency }} />} />
    </CurrencyTab.Navigator>
  )
}
