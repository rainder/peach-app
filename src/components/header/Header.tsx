import { useNavigation } from '@react-navigation/native'
import { ColorValue, TouchableOpacity, View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import { getHeaderStyles } from '../../utils/layout'

const themes = {
  default: {
    text: tw`text-black-1`,
    backButton: tw`text-black-2`,
    bg: tw`bg-primary-background`,
  },
  inverted: {
    text: tw`text-primary-background-light`,
    backButton: tw`text-primary-mild-1`,
    bg: tw`bg-transparent`,
  },
}

export type HeaderIcon = {
  id: IconType
  accessibilityHint?: string
  color?: ColorValue | undefined
  onPress: () => void
}

export type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: HeaderIcon[]
  hideGoBackButton?: boolean
  theme?: 'default' | 'inverted'
  showPriceStats?: boolean
}

export const Header = ({
  title,
  icons,
  titleComponent,
  hideGoBackButton,
  showPriceStats = false,
  theme,
}: HeaderConfig) => {
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()
  const { iconSize, fontSize } = getHeaderStyles()

  const shouldShowBackButton = !hideGoBackButton && canGoBack()

  return (
    <View
      style={[
        tw`items-center px-4 py-1 gap-6px`,
        tw.md`px-8`,
        shouldShowBackButton && [tw`pl-3`, tw.md`pl-22px`],
        colors.bg,
      ]}
    >
      <View style={tw`flex-row justify-between w-full`}>
        <View style={tw`flex-row items-center justify-start flex-grow gap-1`}>
          {shouldShowBackButton && (
            <TouchableOpacity onPress={goBack}>
              <Icon id="chevronLeft" style={iconSize} color={colors.backButton.color} />
            </TouchableOpacity>
          )}
          {title ? (
            <Text style={[...fontSize, colors.text]} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            titleComponent
          )}
        </View>

        <View style={tw`flex-row items-center justify-end gap-10px`}>
          {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
            <TouchableOpacity key={`${i}-${id}`} style={tw`p-2px`} {...{ accessibilityHint, onPress }}>
              <Icon {...{ id, color }} style={iconSize} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {showPriceStats && (
        <>
          <HorizontalLine />
          <BitcoinPriceStats />
        </>
      )}
    </View>
  )
}
