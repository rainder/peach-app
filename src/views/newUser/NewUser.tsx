/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useState } from 'react'
import {
  Image,
  ScrollView,
  View
} from 'react-native'
const { LinearGradient } = require('react-native-gradients')

import tw from '../../styles/tailwind'
import { createAccount } from '../../utils/accountUtils'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Input, Text } from '../../components'
import i18n from '../../utils/i18n'
import { getMessages, rules } from '../../utils/validationUtils'
import { whiteGradient } from '../../utils/layoutUtils'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { MessageContext } from '../../utils/messageUtils'

const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'newUser'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  const [password, setPassword] = useState('')
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { password },
    rules,
    messages: getMessages()
  })

  const onPasswordChange = (value: string) => {
    setPassword(value)

    validate({
      password: {
        required: true,
      }
    })
  }

  const onSuccess = () => {
    navigation.navigate('tutorial')
  }

  const onError = () => {
    updateMessage({
      msg: i18n('createAccount.error'),
      level: 'ERROR',
    })
  }

  const submit = () => {
    const isValid = validate({
      password: {
        required: true
      }
    })
    if (isValid) createAccount({ password, onSuccess, onError })
  }

  return <View style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`w-full h-8 mt-32 -mb-8 z-10`}>
        <LinearGradient colorList={whiteGradient} angle={-90} />
      </View>
      <ScrollView>
        <View style={tw`pb-8 px-8`}>
          <View style={tw`flex items-center`}>
            <Image source={require('../../../assets/favico/peach-icon-192.png')} />
          </View>
          <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
            {i18n('newUser.title')}
          </Text>
          <Text style={tw`mt-4 text-center`}>
            {i18n('newUser.description.1')}
          </Text>
          <Text style={tw`mt-3 text-center`}>
            {i18n('newUser.description.2')}
          </Text>
          <View style={tw`mt-2`}>
            <Input
              onChange={setPassword}
              onSubmit={onPasswordChange}
              secureTextEntry={true}
              value={password}
              isValid={!isFieldInError('password')}
              errorMessage={isFieldInError('password') ? [i18n('form.password.error')] : []}
            />
          </View>
          <View style={tw`mt-4 flex items-center`}>
            <Button
              onPress={submit}
              wide={false}
              title={i18n('createAccount')}
            />
          </View>
        </View>
      </ScrollView>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
    </View>
  </View>
}