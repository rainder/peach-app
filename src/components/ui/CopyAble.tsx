import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable, TextStyle } from 'react-native'
import { Fade } from '../animation'
import { Text } from '../text'
import i18n from '../../utils/i18n'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

const textPositions = {
  left: tw`absolute mr-3 right-full`,
  top: tw`absolute mb-1 bottom-full`,
  right: tw`absolute ml-3 left-full`,
  bottom: tw`absolute mt-1 top-full`,
}
type CopyAbleProps = ComponentProps & {
  value?: string
  color?: TextStyle
  disabled?: boolean
  copied?: boolean
  textPosition?: keyof typeof textPositions
}

export const CopyAble = ({
  value,
  color,
  disabled,
  copied,
  style,
  textPosition = 'bottom',
}: CopyAbleProps): ReactElement => {
  const [showCopied, setShowCopied] = useState(copied || false)

  const copy = useCallback(() => {
    if (!value) return
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }, [value])

  useEffect(() => {
    if (!copied) return
    copy()
  }, [copied, copy])

  return (
    <Pressable
      onPress={copy}
      disabled={!value || disabled}
      style={[tw`flex-row items-center justify-center flex-shrink w-4 h-4`, style]}
    >
      <Icon id="copy" style={tw`w-full h-full`} color={color?.color || tw`text-primary-main`.color} />
      <Fade show={copied || showCopied} duration={300} delay={0} style={textPositions[textPosition]}>
        <Text style={[tw`tooltip`, color || tw`text-primary-main`]}>{i18n('copied')}</Text>
      </Fade>
    </Pressable>
  )
}
