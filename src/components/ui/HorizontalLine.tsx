import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const HorizontalLine = ({ style }: ComponentProps) => <View style={[tw`self-stretch h-px bg-black-5`, style]} />
