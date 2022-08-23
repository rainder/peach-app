import React, { ReactElement, useCallback, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Button, Card, Loading, PeachScrollView, RadioButtons, Text, Title } from '../../components'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { getUserPrivate } from '../../utils/peachAPI'
import { thousands } from '../../utils/string'
import { BonusPointsBar } from './components/BonusPointsBar'
import { RadioButtonItem } from '../../components/inputs/RadioButtons'

type Reward = 'customReferralCode' | 'noPeachFees' | 'sats'
type Props = {
  navigation: Navigation
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [user, setUser] = useState<User>()
  const pointsBalance = user?.bonusPoints || 0
  const [selectedReward, setSelectedReward] = useState<Reward>('')

  const rewards: RadioButtonItem<Reward>[] = [
    ['customReferralCode', 100, '100'],
    ['noPeachFees', 200, '200'],
    ['sats', 300, '> 300'],
  ].map(([reward, pointsRequired, cost]) => ({
    value: reward,
    disabled: pointsRequired > pointsBalance,
    display: <Text style={tw`font-baloo text-sm`}>
      {i18n(`referrals.reward.${reward}`)} <Text style={tw`text-sm text-grey-2`}>({cost})</Text>
    </Text>
  }) as RadioButtonItem<Reward>)

  const shareReferralCode = () => {}

  const redeemReward = () => {}

  useFocusEffect(useCallback(() => {
    (async () => {
      const [response, err] = await getUserPrivate(account.publicKey)

      if (response) {
        setUser(response)
      }
      // TODO add error handling if request failed
    })()
  }, []))


  return !user
    ? <Loading />
    : <View style={tw`h-full flex items-stretch`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12 pb-10`}>
        <Title title={i18n('referrals.title')} />
        <BonusPointsBar style={tw`mt-2`} points={pointsBalance} />
        <View style={tw`mt-8`}>
          <Text style={tw`text-center font-baloo text-grey-2 leading-6`}>
            {i18n('referrals.yourCode')}
          </Text>
          <Text style={tw`text-center text-grey-1 font-baloo text-2xl leading-2xl mt-1`}>
            {user.referralCode}
          </Text>
          <View style={tw`flex items-center mt-1`}>
            <Button
              title={i18n('referrals.shareCode')}
              wide={true}
              onPress={shareReferralCode}
            />
          </View>
          <Card style={tw`mt-10 p-7`}>
            <Text style={tw`text-center text-grey-1`}>
              {i18n(
                'referrals.alreadyTraded',
                i18n('currency.format.sats', thousands(user.referredTradingAmount || 0))
              )}
              {'\n\n'}
              {i18n('referrals.selectReward')}
            </Text>
            <RadioButtons style={tw`mt-4`}
              selectedValue={selectedReward}
              items={rewards}
              onChange={setSelectedReward}
            />
            <View style={tw`flex items-center mt-5`}>
              <Button
                title={i18n('referrals.reward.select')}
                wide={false}
                disabled={true}
                onPress={redeemReward}
              />
            </View>
            <Text style={tw`text-center text-grey-1 text-sm mt-1`}>
              {i18n('referrals.reward.comingSoon')}
            </Text>
          </Card>
        </View>
        <View style={tw`flex items-center mt-16`}>
          <Button
            title={i18n('back')}
            wide={false}
            secondary={true}
            onPress={navigation.goBack}
          />
        </View>
      </PeachScrollView>
    </View>
}

