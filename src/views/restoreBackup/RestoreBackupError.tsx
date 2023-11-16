import { View } from 'react-native'
import { Icon, Text } from '../../components'

import { Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  err: string
}

export const RestoreBackupError = ({ err }: Props) => {
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('contact')

  return (
    <View style={tw`justify-between grow`}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <View>
          <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.title')}</Text>
          <Text style={tw`text-center body-l text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        </View>
        <Icon id="userX" size={128} color={tw`text-primary-background-light`.color} />
      </View>
      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw`text-primary-main`}
        onPress={goToContact}
      >
        {i18n('contactUs')}
      </Button>
    </View>
  )
}
