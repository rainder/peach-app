import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Button, Headline, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { Navigation } from '../utils/navigation'

type Props = {
  offer: SellOffer
  days: string
  navigation: Navigation
}

export default ({ offer, days, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToOffer = () => {
    if (!offer.id) return
    navigation.navigate('offer', { offerId: offer.id })
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('offerNotFunded.title')}</Headline>
      <Text style={tw`mt-5 text-center text-white-1`}>
        {i18n('offerNotFunded.description.1', days)}
        {'\n'}
        {i18n('offerNotFunded.description.2')}
      </Text>
      <View style={tw`flex items-center justify-center mt-5`}>
        <Button title={i18n('goToOffer')} secondary={true} wide={false} onPress={goToOffer} />
        <Button title={i18n('close')} style={tw`mt-2`} tertiary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
