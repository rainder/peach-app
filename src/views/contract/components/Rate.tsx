import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'

import { Button, Card, Headline, Text } from '../../../components'
import Icon from '../../../components/Icon'
import tw from '../../../styles/tailwind'
import { createUserRating } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { MessageContext } from '../../../contexts/message'
import { rateUser } from '../../../utils/peachAPI'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type RateProps = {
  contract: Contract,
  view: 'seller' | 'buyer' | ''
  navigation: ProfileScreenNavigationProp,
  saveAndUpdate: (contract: Contract) => void
}

export default ({ contract, view, navigation, saveAndUpdate }: RateProps): ReactElement => {
  const [vote, setVote] = useState('')
  const [, updateMessage] = useContext(MessageContext)

  const rate = async () => {
    if (!view) return

    const rating = createUserRating(
      view === 'seller' ? contract.buyer.id : contract.seller.id,
      vote === 'positive' ? 1 : -1
    )
    const ratedUser = view === 'seller' ? 'ratingBuyer' : 'ratingSeller'

    const [result, err] = await rateUser({
      contractId: contract.id,
      rating: rating.rating,
      signature: rating.signature
    })

    if (err) {
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }
    saveAndUpdate({
      ...contract,
      [ratedUser]: true
    })

    navigation.replace('tradeComplete', { contract, view })
  }
  return <View>
    <Card style={tw`p-4`}>
      <Headline style={tw`text-3xl leading-3xl text-center`}>
        {i18n('rate.title')}
      </Headline>
      <Text style={tw`mt-2 text-grey-2 text-center`}>{i18n('rate.subtitle')}</Text>

      <View style={tw`mt-4 flex-row justify-center`}>
        <Pressable onPress={() => setVote('negative')}>
          <Icon id="negative"
            style={[tw`w-6 h-6 mx-2`, vote !== 'negative' ? tw`opacity-30` : {}]}
            color={tw`text-peach-1`.color as string}
          />
        </Pressable>
        <Pressable onPress={() => setVote('positive')}>
          <Icon id="positive"
            style={[tw`w-6 h-6 mx-2`, vote !== 'positive' ? tw`opacity-30` : {}]}
            color={tw`text-peach-1`.color as string}
          />
        </Pressable>
      </View>
    </Card>
    <View style={tw`mt-4 flex items-center`}>
      <Button
        title={i18n('rate')}
        disabled={!vote}
        wide={false}
        onPress={rate}
      />
    </View>
  </View>
}