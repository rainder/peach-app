import React, { ReactElement, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { Button, Fade, Headline, Icon, Loading, PeachScrollView, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { account } from '../../utils/account'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import Clipboard from '@react-native-clipboard/clipboard'
import { splitAt, toShortDateFormat } from '../../utils/string'
import { Rating, ExtraMedals } from '../../components/user'
import { getUser } from '../../utils/peachAPI'

type ProgressProps = ComponentProps & {
  percent: number,
  text?: string,
}
const Progress = ({ percent, text, style }: ProgressProps): ReactElement =>
  <View style={[tw`h-4 bg-peach-translucent overflow-hidden`, style]}>
    <View style={[tw`h-full bg-peach-1`, { width: `${percent * 100}%` }]}/>
    {text
      ? <View style={tw`absolute w-full`}>
        <Text style={tw`text-sm font-baloo text-white-2 text-center uppercase -mt-px`}>
          {text}
        </Text>
      </View>
      : null
    }
  </View>

type TradingLimitProps = ComponentProps & {
  tradingLimit: TradingLimit,
}
const TradingLimit = ({ tradingLimit, style }: TradingLimitProps): ReactElement => {
  const { daily, dailyAmount, yearly, yearlyAmount } = tradingLimit
  return <View style={style}>
    <Text style={tw`text-center text-grey-1 font-bold`}>
      {i18n('profile.tradingLimits')}
    </Text>
    <Progress
      style={tw`rounded`}
      percent={dailyAmount / daily}
      text={i18n('profile.tradingLimits.daily', String(dailyAmount), String(daily === Infinity ? '∞' : daily))}
    />
    <Progress
      style={tw`mt-1 rounded`}
      percent={yearlyAmount / yearly}
      text={i18n('profile.tradingLimits.yearly', String(dailyAmount), String(daily === Infinity ? '∞' : daily))}
    />
  </View>
}

type UserTradeDetailsProps = {
  user: User,
}

const UserTradeDetails = ({ user }: UserTradeDetailsProps): ReactElement => <View>
  <Text style={tw`text-center font-bold text-grey-1 mt-4`}>
    {i18n('profile.numberOfTrades')}
  </Text>
  <Text style={tw`text-center text-grey-1`}>
    {user.trades}
  </Text>

  <Text style={tw`text-center font-bold text-grey-1 mt-4`}>
    {i18n('profile.disputes')}
  </Text>
  <Text style={tw`text-center text-grey-1`}>
    {i18n('profile.disputesOpened')}: {user.disputes.opened}
  </Text>
  <Text style={tw`text-center text-grey-1`}>
    {i18n('profile.disputesWon')}: {user.disputes.won}
  </Text>
  <Text style={tw`text-center text-grey-1`}>
    {i18n('profile.disputesLost')}: {user.disputes.lost}
  </Text>
</View>


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile'>

type Props = {
  route: RouteProp<{ params: RootStackParamList['profile'], }>,
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const { userId } = route.params
  const [updatePending, setUpdatePending] = useState(!route.params.user)
  const [showCopied, setShowCopied] = useState(false)
  const [user, setUser] = useState<User|undefined>(route.params.user)
  const isMyAccount = account.publicKey === userId
  const publicKey = splitAt(userId, Math.floor(userId.length / 2) - 1).join('\n')
  const now = new Date()
  const [accountAge, setAccountAge] = useState(0)

  useFocusEffect(useCallback(() => {
    (async () => {
      if (route.params.user) {
        const creationDate = new Date(route.params.user.creationDate)
        setUser(route.params.user)
        setAccountAge(Math.floor((now.getTime() - (creationDate).getTime()) / (86400 * 1000)))

        setUpdatePending(false)
        return
      }
      setUpdatePending(true)
      const [response, err] = await getUser(userId)

      if (response) {
        setUser(response)
        setAccountAge(Math.floor((now.getTime() - (new Date(response.creationDate)).getTime()) / (86400 * 1000)))
      }
      setUpdatePending(false)

      // TODO add error handling if request failed
    })()
  }, []))

  const copy = () => {
    Clipboard.setString(userId)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }

  return <View style={tw`h-full flex items-stretch`}>
    <PeachScrollView contentContainerStyle={tw`pt-6 px-12 pb-10`}>
      <Title title={i18n(isMyAccount ? 'profile.myAccount.title' : 'profile.user.title')} />
      <View style={tw`mt-12`}>
        <Headline style={tw`text-center text-grey-1 font-bold`}>
          Peach{userId.substring(0, 8)}
        </Headline>
        {user
          ? <View style={tw`flex items-center`}>
            <Rating rating={user.rating} style={tw`mt-1`} />
            <ExtraMedals user={user} style={tw`mt-2`} />
          </View>
          : null
        }

        <Text style={tw`text-center font-bold text-grey-1 mt-4`}>
          {i18n('profile.accountCreated')}
        </Text>
        <Text style={tw`text-center text-grey-1`}>
          {user
            ? toShortDateFormat(new Date(user.creationDate))
            : ''
          } ({i18n('profile.daysAgo', accountAge.toString())})
        </Text>
        <Text style={tw`text-center text-grey-1 font-bold mt-4`}>
          {i18n('profile.publicKey')}
        </Text>
        <Pressable onPress={copy} style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-sm text-grey-2`}>{publicKey}</Text>
          <View>
            <Fade show={showCopied} duration={300} delay={0} >
              <Text style={[
                tw`absolute -top-6 w-20 left-1/2 -ml-10`,
                tw`font-baloo text-grey-1 text-sm uppercase text-center`
              ]}>
                {i18n('copied')}
              </Text>
            </Fade>
            <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-peach-1`.color as string}/>
          </View>
        </Pressable>
        {updatePending
          ? <View style={tw`mt-4 h-10`}><Loading /></View>
          : null
        }
        {isMyAccount
          ? <TradingLimit tradingLimit={account.tradingLimit} style={tw`mt-4 px-2`} />
          : null
        }
        {user
          ? <UserTradeDetails user={user} />
          : null
        }
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

