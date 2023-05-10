import { View } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'
import { HorizontalLine } from '../ui'

type Props = ComponentProps & {
  disputeActive?: boolean
  iconId?: IconType
  text: string
}
export const TradeSeparator = ({ style, disputeActive, iconId, text }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    {disputeActive && !!iconId && <Icon id={iconId} style={tw`w-4 h-4 mr-1`} color={tw`text-error-main`.color} />}
    <Text style={[tw`mr-1 text-black-2`, disputeActive && tw`text-error-main`]}>{text}</Text>
    <HorizontalLine style={[tw`flex-grow ml-1`, disputeActive && tw`bg-error-mild`]} />
  </View>
)
