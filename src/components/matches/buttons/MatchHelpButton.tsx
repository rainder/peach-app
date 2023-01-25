import React, { useContext } from 'react'
import { Pressable } from 'react-native'
import { OverlayContext } from '../../../contexts/overlay'
import DoubleMatch from '../../../overlays/info/DoubleMatch'
import MatchOverlay from '../../../overlays/info/Match'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'

export const MatchHelpButton = ({ isBuyOffer }: { isBuyOffer: boolean }) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const openMatchHelp = () =>
    updateOverlay({
      content: isBuyOffer ? <MatchOverlay /> : <DoubleMatch />,
      showCloseButton: true,
      help: true,
    })
  return (
    <Pressable onPress={openMatchHelp} style={tw`p-3`}>
      <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
    </Pressable>
  )
}
