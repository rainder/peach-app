import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Button, Title } from '../../components'
import ProvideRefundAddress from '../../overlays/info/ProvideRefundAddress'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import ReturnAddress from './components/ReturnAddress'
import { saveOffer } from '../../utils/offer'
import { patchOffer } from '../../utils/peachAPI'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'

type Props = {
  route: RouteProp<{ params: RootStackParamList['setReturnAddress'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<SellOffer>(route.params.offer)
  const [returnAddress, setReturnAddress] = useState(route.params.offer.returnAddress)

  useFocusEffect(
    useCallback(() => {
      setOffer(route.params.offer)
      setReturnAddress(route.params.offer.returnAddress)
    }, [route]),
  )

  const submit = async () => {
    const [patchOfferResult, patchOfferError] = await patchOffer({
      offerId: offer.id!,
      returnAddress,
    })
    if (patchOfferResult) {
      const patchedOffer = {
        ...offer,
        returnAddress,
        returnAddressRequired: false,
      }
      saveOffer(patchedOffer)
      if (offer.online) {
        navigation.replace('search', { offerId: patchedOffer.id })
        return
      }
      navigation.navigate('fundEscrow', { offer: patchedOffer })
    } else if (patchOfferError) {
      error('Error', patchOfferError)
      updateMessage({
        msgKey: patchOfferError?.error || 'error.general',
        level: 'ERROR',
      })
    }
  }

  return (
    <View style={tw`flex items-stretch h-full px-6 pt-6 pb-10`}>
      <Title
        title={i18n('sell.title')}
        subtitle={i18n('offer.requiredAction.provideReturnAddress')}
        help={<ProvideRefundAddress />}
      />
      <View style={tw`flex-shrink h-full mt-12`}>
        <ReturnAddress style={tw`mt-16`} returnAddress={returnAddress} required={true} update={setReturnAddress} />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button
          title={i18n(!returnAddress ? 'sell.setReturnAddress.provideFirst' : 'confirm')}
          style={tw`w-52`}
          disabled={!returnAddress}
          wide={false}
          onPress={submit}
        />
        <Button style={tw`mt-2 w-52`} title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
