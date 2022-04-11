import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow, Text } from '..'

interface Item {
  value: string|number|boolean,
  display: ReactNode
}

type RadioButtonsProps = ComponentProps & {
  items: Item[],
  selectedValue?: string|number|boolean,
  onChange?: (value: (string|number|boolean)) => void,
}

/**
 * @description Component to display radio buttons
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.onChange] on change handler
 * @param [props.style] css style object
 * @example
 * <RadioButtons
    items={[
      {
        value: true,
        display: <Text>{i18n('yes')}</Text>
      },
      {
        value: false,
        display: <Text>{i18n('no')}</Text>
      }
    ]}
    selectedValue={kyc}
    onChange={(value) => setKYC(value as boolean)}/>
 */
export const RadioButtons = ({ items, selectedValue, onChange, style }: RadioButtonsProps): ReactElement =>
  <View style={style}>
    {items.map((item, i) => <View key={i} style={item.value !== selectedValue ? tw`opacity-50` : {}}>
      <Shadow {...mildShadow}
        viewStyle={[
          tw`w-full`,
          i > 0 ? tw`mt-2` : {}
        ]}>
        <Pressable style={tw`flex-row items-center p-3 bg-white-1 border border-grey-4 rounded`}
          onPress={() => onChange ? onChange(item.value) : null}>
          <View style={tw`w-5 h-5 rounded-full border-2 border-grey-3 flex justify-center items-center`}>
            {item.value === selectedValue
              ? <Icon id="circle" style={tw`w-3 h-3`} />
              : null
            }
          </View>
          <Text style={tw`ml-4`}>
            {item.display}
          </Text>
        </Pressable>
      </Shadow>
    </View>
    )}
  </View>

export default RadioButtons