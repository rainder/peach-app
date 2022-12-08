import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../'

export type TabbedNavigationItem = {
  id: string
  display: string
  view: () => ReactElement
}
type TabbedNavigationProps = {
  items: TabbedNavigationItem[]
  selected: TabbedNavigationItem
  select: (item: TabbedNavigationItem) => void
}

export const TabbedNavigation = ({ items, selected, select }: TabbedNavigationProps) => (
  <View style={tw`flex flex-row justify-center`}>
    {items.map((item) => (
      <Pressable style={tw`px-2`} key={item.id} onPress={() => select(item)}>
        <Text
          style={[tw`font-baloo leading-xl px-4 py-2`, item.id === selected.id ? tw`text-black-1` : tw`text-grey-2`]}
        >
          {item.display}
        </Text>
        {item.id === selected.id && <View style={tw`w-full h-0.5 bg-black-1`} />}
      </Pressable>
    ))}
  </View>
)
