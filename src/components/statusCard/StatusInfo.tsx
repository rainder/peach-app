import { StyleProp, TextStyle, View } from 'react-native'
import tw from '../../styles/tailwind'
import { FixedHeightText } from '../text/FixedHeightText'

type Props = {
  title: string
  icon?: JSX.Element
  subtext: string
  onPress?: () => void
  titleStyle?: StyleProp<TextStyle>
  subtextStyle?: StyleProp<TextStyle>
}

export function StatusInfo ({ icon, title, subtext, onPress, titleStyle, subtextStyle }: Props) {
  return (
    <View style={tw`gap-1 shrink`}>
      <FixedHeightText height={17} style={[tw`subtitle-1`, titleStyle]} numberOfLines={1}>
        {title}
      </FixedHeightText>

      <View style={tw`flex-row items-center gap-6px`}>
        {icon}
        <FixedHeightText
          style={[tw`body-s text-black-65`, subtextStyle, !!icon && tw`w-100px`]}
          height={17}
          onPress={onPress}
          suppressHighlighting={!onPress}
        >
          {subtext}
        </FixedHeightText>
      </View>
    </View>
  )
}
