import React, { ReactElement, useContext, useReducer, useRef, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import i18n from '../../utils/i18n'


export default (): ReactElement => {
  useContext(LanguageContext)

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('welcome.peachOfMind.title')}
    </Text>
    <Text style={tw`mt-6 text-center`}>
      {i18n('welcome.peachOfMind.description.1')}
    </Text>
    <Text style={tw`mt-4 text-center`}>
      {i18n('welcome.peachOfMind.description.2')}
    </Text>
    <Text style={tw`mt-4 text-center font-lato-bold`}>
      {i18n('welcome.peachOfMind.description.3')}
    </Text>
    <Text style={tw`mt-4 text-center font-lato-bold`}>
      {i18n('welcome.peachOfMind.description.4')}
    </Text>
  </View>
}