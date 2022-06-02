
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button } from '.'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'

/**
 * @description Component to display the Overlay
 * @param props Component properties
 * @param props.content the overlay content
 * @param props.showCloseButton if true show close button
 * @example
 * <Overlay content={<Text>Overlay content</Text>} showCloseButton={true} />
 */
export const Overlay = ({ content, showCloseButton }: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  return <View style={[
    tw`absolute z-20 w-full h-full flex items-center justify-center`,
    tw`p-3 pb-8 bg-peach-translucent-2`,
  ]}>
    {content}
    {showCloseButton
      ? <Button
        style={tw`mt-7`}
        title={i18n('close')}
        secondary={true}
        onPress={closeOverlay}
        wide={false}
      />
      : null
    }
  </View>
}

export default Overlay