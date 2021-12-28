import React, { ReactElement, ReactNode, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow } from 'react-native-shadow-2'
import { innerShadow, mildShadow } from '../../utils/layoutUtils'

interface Item {
  value: string|number,
  display: (isOpen: boolean) => ReactNode
}

interface DropdownProps {
  items: Item[],
  width?: number,
  selectedValue?: string|number,
  onChange?: (value: string|number) => void
  onToggle?: (isOpen: boolean) => void
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.width] dropdown width
 * @param props.onChange method to set locale on value change
 * @param [props.onToggle] callback function when dropdown opens or closes
 * @example
 * <Dropdown
 *   selectedValue={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 *   width={tw`w-72`.width as number}
 *   items={[
 *     {
 *       value: 500000,
 *       display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
 *         <View style={tw`flex-row justify-start items-center`}>
 *           <Text style={tw`font-mono text-grey-2`}>0.00</Text><Text style={tw`font-mono`}> 500 000 Sat</Text>
 *         </View>
 *         {isOpen
 *           ? <Text style={tw`font-mono text-peach-1`}>€50</Text>
 *           : null
 *         }
 *       </View>
 *     },
 *     {
 *       value: 1000000,
 *       display: (isOpen: boolean) => <View>
 *         <Text>0.01 000 000 Sat</Text>
 *         {isOpen
 *           ? <Text>€100</Text>
 *           : null
 *         }
 *       </View>
 *     }
 *   ]}
 * />
 */
export const Dropdown = ({ items, selectedValue, width = 273, onChange, onToggle }: DropdownProps): ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const height = tw`h-10`.height as number * (isOpen ? items.length + 1 : 1)
  const selectedItem = items.find(item => item.value === selectedValue)

  const toggle = () => {
    setOpen(!isOpen)
    if (onToggle) onToggle(isOpen)
  }
  const select = (item: Item) => {
    if (onChange) onChange(item.value)
    toggle()
  }

  return <View style={[
    tw`z-10 rounded`,
    !isOpen ? tw`overflow-hidden` : {}
  ]}>
    <Shadow {...(isOpen ? mildShadow : innerShadow)}
      viewStyle={[
        { width, height },
        tw`py-0 pl-4 pr-3 border border-grey-4 rounded`,
        isOpen ? tw`bg-white-1` : {}
      ]}>
      {isOpen
        ? [
          <Pressable key={selectedItem?.value} style={tw`h-10 flex justify-center opacity-30`}
            onPress={toggle}>
            {selectedItem?.display(false)}
          </Pressable>,
          items
            .map(item => <Pressable
              key={item.value}
              style={tw`h-10 flex justify-center`}
              onPress={() => select(item)}>
              {item.display(isOpen)}
            </Pressable>
            )
        ]
        : <Pressable style={tw`h-10 flex justify-center`} onPress={toggle}>
          {items.find(item => item.value === selectedValue)?.display(isOpen)}
        </Pressable>
      }
    </Shadow>
    <Icon id={isOpen ? 'dropdownOpen' : 'dropdownClosed'}
      style={tw`w-6 h-10 absolute right-2`}
      color={tw`text-peach-1`.color as string}
    />
  </View>
}

export default Dropdown