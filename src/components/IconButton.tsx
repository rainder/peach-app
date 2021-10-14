
import React, { ReactElement, useState } from 'react'
import {
  Pressable,
  View,
  ViewStyle
} from 'react-native'
import tw from '../styles/tailwind'
import Icon from './Icon'
import Text from './Text'

interface IconButtonProps {
  icon: string,
  title: string,
  style?: ViewStyle|ViewStyle[],
  onPress?: Function
}

/**
 * @description Component to display the Button
 * @param props Component properties
 * @param props.icon icon id
 * @param props.title button text
 * @param [props.style] css style object
 * @param [props.onPress] onPress handler from outside
 * @example
 * <Button
 *   title={i18n('form.save')}
 *   style={tw`mt-4`}
 *   onPress={save}
 * />
 */
export const IconButton = ({ icon, title, style, onPress }: IconButtonProps): ReactElement => {
  const [active, setActive] = useState(false)

  return <View>
    <Pressable
      style={[
        tw`w-14 h-10 flex-col items-center justify-between p-0 rounded bg-peach-1`,
        active ? tw`bg-peach-2` : {},
        style || {}
      ]}
      onPress={e => onPress ? onPress(e) : null}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
    >
      <Icon id={icon} style={tw`w-5 h-5`} />
      <Text style={tw`font-baloo text-xs uppercase text-white-1`}>
        {title}
      </Text>
    </Pressable>
  </View>
}

export default IconButton