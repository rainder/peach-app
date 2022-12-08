import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../../../styles/tailwind'

import { Button, Card, Headline, PeachScrollView, Text } from '../../../../components'
import { useNavigation } from '../../../../hooks'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

export default (): ReactElement => {
  const navigation = useNavigation()
  const [showWords, setShowWords] = useState(false)

  const iUnderstand = () => setShowWords(true)
  return (
    <View style={tw`h-full flex flex-col flex-shrink`}>
      <PeachScrollView style={tw`h-full flex flex-col flex-shrink`}>
        {showWords ? (
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
        ) : (
          <View style={tw`h-full flex-shrink flex justify-center items-center`}>
            <Headline style={tw`text-grey-1`}>{i18n('settings.seedWords.note')}</Headline>
            <Text style={tw`text-grey-1`}>{i18n('settings.seedWords.note.description')}</Text>
          </View>
        )}
      </PeachScrollView>
      <View style={tw`flex items-center mt-16`}>
        {!showWords && (
          <Button style={tw`mb-2`} title={i18n('settings.seedWords.iUnderstand')} wide={false} onPress={iUnderstand} />
        )}
        <Button title={i18n('back')} wide={false} secondary onPress={navigation.goBack} />
      </View>
    </View>
  )
}
