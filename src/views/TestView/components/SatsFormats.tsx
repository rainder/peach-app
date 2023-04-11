import { View } from 'react-native'
import { SatsFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const SatsFormats = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Sats Format</Text>
    <SatsFormat sats={0} />
    <SatsFormat sats={1} />
    <SatsFormat sats={12} />
    <SatsFormat sats={123} />
    <SatsFormat sats={1234} />
    <SatsFormat sats={12345} />
    <SatsFormat sats={123456} />
    <SatsFormat sats={1234567} />
    <SatsFormat sats={12345678} />
    <SatsFormat sats={123456789} />
    <SatsFormat sats={1234567890} />
    <SatsFormat sats={1000000000} />
    <SatsFormat sats={10000000000} />
  </View>
)
