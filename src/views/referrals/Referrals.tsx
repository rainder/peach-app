import { useState } from 'react'
import { View } from 'react-native'
import { Header, PeachScrollView, Progress, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { RadioButtonItem, RadioButtons } from '../../components/inputs/RadioButtons'
import { useShowHelp } from '../../hooks'
import { useSelfUser } from '../../hooks/query/useSelfUser'
import { useRedeemNoPeachFeesReward } from '../../popups/referral/useRedeemNoPeachFeesReward'
import { useSetCustomReferralCodePopup } from '../../popups/referral/useSetCustomReferralCodePopup'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { thousands } from '../../utils/string'
import { ReferralCode } from './components/ReferralCode'
import { REWARDINFO } from './constants'
import { isRewardAvailable } from './helpers/isRewardAvailable'
import { mapRewardsToRadioButtonItems } from './helpers/mapRewardsToRadioButtonItems'

export const Referrals = () => (
  <Screen header={<ReferralsHeader />}>
    <BonusPointsBar />
    <PeachScrollView contentContainerStyle={tw`justify-center grow`} contentStyle={tw`gap-4 py-4`}>
      <ReferralRewards />
      <ReferralCode />
    </PeachScrollView>
  </Screen>
)

function ReferralsHeader () {
  const showHelp = useShowHelp('referrals')
  return <Header title={i18n('settings.referrals')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

function ReferralRewards () {
  const { user } = useSelfUser()
  const balance = user?.bonusPoints || 0
  const referredTradingAmount = user?.referredTradingAmount || 0

  const availableRewards = REWARDINFO.filter((reward) => isRewardAvailable(reward, balance)).length
  const [selectedReward, setSelectedReward] = useState<RewardType>()

  const rewards: RadioButtonItem<RewardType>[] = mapRewardsToRadioButtonItems(balance)

  return (
    <>
      <Text style={tw`text-center`}>
        {i18n(
          !referredTradingAmount ? 'referrals.notTraded' : 'referrals.alreadyTraded',
          i18n('currency.format.sats', thousands(referredTradingAmount)),
        )}
        {'\n\n'}
        {i18n(availableRewards ? 'referrals.selectReward' : 'referrals.continueSaving')}
      </Text>
      <RadioButtons items={rewards} selectedValue={selectedReward} onButtonPress={setSelectedReward} />
      <RedeemButton selectedReward={selectedReward} />
    </>
  )
}

function RedeemButton ({ selectedReward }: { selectedReward: RewardType | undefined }) {
  const { setCustomReferralCodePopup } = useSetCustomReferralCodePopup()
  const redeemNoPeachFeesReward = useRedeemNoPeachFeesReward()
  const redeem = () => {
    if (selectedReward === 'customReferralCode') {
      setCustomReferralCodePopup()
    } else if (selectedReward === 'noPeachFees') {
      redeemNoPeachFeesReward()
    }
  }
  return (
    <Button style={tw`self-center`} disabled={!selectedReward} onPress={redeem} iconId={'gift'}>
      {i18n('referrals.reward.select')}
    </Button>
  )
}

function BonusPointsBar () {
  const BARLIMIT = 400
  const { user } = useSelfUser()
  const balance = user?.bonusPoints || 0

  return (
    <View>
      <Progress
        style={tw`h-3 rounded`}
        backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background`}
        barStyle={tw`border-2 bg-primary-main border-primary-background`}
        percent={balance / BARLIMIT}
      />
      <Text style={tw`pl-2 tooltip text-black-2`}>
        {i18n('referrals.points')}: <Text style={tw`font-bold tooltip text-black-2`}>{balance}</Text>
      </Text>
    </View>
  )
}
