import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../../../styles/tailwind'

import { Card, Headline, Icon, PeachScrollView, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useNavigation, useToggleBoolean } from '../../../../hooks'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { Checkbox } from '../../../../components/inputs/Checkbox'

const translationPath = 'settings.seedWords.note'
const KeepPhraseSecure = (): ReactElement => {
  const [checked, toggle] = useToggleBoolean()
  return (
    <View style={tw`h-full flex-shrink flex justify-center items-center`}>
      <Text>to restore your peach wallet</Text>
      <Text>keep your seed phrase secure!</Text>
      <Icon id="edit" />
      <Text>Write it down on a piece of paper</Text>
      <Icon id="cameraOff" />
      <Text>Store it in a safe place</Text>
      <Icon id="cloudOff" />
      <Text>Don't share it with anyone</Text>
      <Checkbox
        {...{
          onPress: toggle,
          item: { display: undefined, value: 'read&understood' },
          checked,
          editing: false,
        }}
      />
    </View>
  )
}

const SeedPhrase = (): ReactElement => (
  <View style={tw`h-full flex-shrink flex-row`}>
    <View style={tw`w-1/2 pr-2`}>
      {account.mnemonic
        ?.split(' ')
        .slice(0, 6)
        .map((word, i) => (
          <Card key={i} style={tw`flex-row items-center p-2 mb-2`}>
            <View>
              <Text style={tw`text-lg text-black-1 w-7`}>{i + 1}.</Text>
            </View>
            <View>
              <Text style={tw`text-peach-1 ml-4`}>{word}</Text>
            </View>
          </Card>
        ))}
    </View>
    <View style={tw`w-1/2 pl-2`}>
      {account.mnemonic
        ?.split(' ')
        .slice(6, 12)
        .map((word, i) => (
          <Card key={i} style={tw`flex-row items-center  p-2 mb-2`}>
            <View>
              <Text style={tw`text-lg text-black-1 w-7`}>{i + 7}.</Text>
            </View>
            <View>
              <Text style={tw`text-peach-1 ml-4`}>{word}</Text>
            </View>
          </Card>
        ))}
    </View>
  </View>
)

export default (): ReactElement => {
  const navigation = useNavigation()
  const [showWords, setShowWords] = useState(false)

  const iUnderstand = () => setShowWords(true)
  return (
    <View style={tw`h-full flex flex-col flex-shrink`}>
      <PeachScrollView style={tw`h-full flex flex-col flex-shrink`}>
        {showWords ? <SeedPhrase /> : <KeepPhraseSecure />}
      </PeachScrollView>
      <View style={tw`flex items-center mt-16`}>
        {!showWords && (
          <PrimaryButton style={tw`mb-2`} narrow onPress={iUnderstand}>
            {i18n('settings.seedWords.iUnderstand')}
          </PrimaryButton>
        )}
        <PrimaryButton narrow onPress={navigation.goBack}>
          {i18n('back')}
        </PrimaryButton>
      </View>
    </View>
  )
}
