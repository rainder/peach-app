import React, { ReactElement, useState } from 'react'
import {
  Button,
  TextInput,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { backupAccount, createAccount, getAccount, recoverAccount } from '../../utils/accountUtils'
import { StackNavigationProp } from '@react-navigation/stack'

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
  let [password] = useState('')

  return <View style={tw`flex-col justify-center h-full`}>
    <View style={tw`mt-4`}>
      <TextInput
        placeholder="Password"
        onChangeText={value => password = value}
        secureTextEntry={true}
      />
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => createAccount(null, password)} title="Create account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => getAccount(password)} title="Get account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={backupAccount} title="Backup account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => recoverAccount(password)} title="Recover account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => navigation.goBack()} title="Back"/>
    </View>
  </View>
}