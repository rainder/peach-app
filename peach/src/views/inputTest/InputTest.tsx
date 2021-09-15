import React, { ReactElement, useState, useContext } from 'react'
import {
  Button,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import Input from '../../components/inputs/Input'
import { getMessages, rules } from '../../utils/validationUtils'
import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'
// import { fromBase58Check, fromBech32 } from 'bitcoinjs-lib/types/address'
const { useValidation } = require('react-native-form-validator')

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined,
  InputTest: undefined
}

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [prestine, setPristine] = useState(true)
  const [address, setAddress] = useState('')

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { address },
    rules,
    messages: getMessages()
  })

  const onSubmit = () => {
    if (prestine) setPristine(false)
    validate({
      address: {
        required: true,
        bitcoinAddress: true
      }
    })
  }

  // in case of context change retrigger validation
  // if (!prestine) onSubmit()

  return <View style={tw`flex-col justify-center h-full px-4`}>
    <View style={tw`mt-4`}>
      <Input
        onChange={setAddress}
        value={address}
        label={i18n('form.btcAddress')}
        isValid={!isFieldInError('address')}
        errorMessage={getErrorsInField('address')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={onSubmit} title="Validate"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => navigation.goBack()} title="Back"/>
    </View>
  </View>
}