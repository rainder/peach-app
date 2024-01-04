import { TouchableOpacity } from 'react-native'
import tw from '../../../styles/tailwind'
import { openAppLink } from '../../../utils/web/openAppLink'
import { Icon } from '../../Icon'
import { PeachText } from '../../text/PeachText'

type Props = { text: string; url: string }
export const Link = ({ text, url }: Props) => (
  <TouchableOpacity style={tw`flex-row items-center gap-1`} onPress={() => openAppLink(url)}>
    <PeachText style={tw`underline button-large text-black-65`}>{text}</PeachText>
    <Icon id={'externalLink'} style={tw`w-5 h-5`} color={tw.color('primary-main')} />
  </TouchableOpacity>
)
