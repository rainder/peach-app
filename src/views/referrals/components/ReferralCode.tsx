import { View } from 'react-native'
import Share from 'react-native-share'
import { CopyAble, Text } from '../../../components'
import { Button } from '../../../components/buttons/Button'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { getInviteLink } from '../helpers/getInviteLink'

type Props = {
  referralCode: string
}

export const ReferralCode = () => {
  const { user } = useSelfUser()
  const referralCode = user?.referralCode

  if (!referralCode) {
    return <></>
  }

  const inviteLink = getInviteLink(referralCode)

  return (
    <View style={tw`gap-4`}>
      <YourCode {...{ referralCode }} />
      <InviteLink {...{ inviteLink }} />
      <InviteFriendsButton {...{ referralCode, inviteLink }} />
    </View>
  )
}

function YourCode ({ referralCode }: Props) {
  return (
    <View>
      <Text style={tw`text-center body-m text-black-2`}>{i18n('referrals.yourCode')}</Text>
      <View style={tw`flex-row justify-center`}>
        <Text style={tw`mr-1 text-center h4`}>{referralCode}</Text>
        <CopyAble value={referralCode} style={tw`w-7 h-7`} />
      </View>
    </View>
  )
}

function InviteLink ({ inviteLink }: { inviteLink: string }) {
  return (
    <View style={tw`flex-row items-center justify-between p-4 border rounded-lg border-primary-main`}>
      <View>
        <Text style={tw` body-m text-black-2`}>{i18n('referrals.inviteLink')}</Text>
        <Text style={tw`text-3xs`}>{inviteLink.replace('https://', '')}</Text>
      </View>
      <CopyAble value={inviteLink} style={tw`w-7 h-7`} />
    </View>
  )
}

function InviteFriendsButton ({ referralCode, inviteLink }: { referralCode: string; inviteLink: string }) {
  const inviteFriend = () => {
    Share.open({
      message: i18n('referrals.inviteText', referralCode, inviteLink),
    }).catch((e) => {
      info('User cancel invite friends share', e)
    })
  }
  return (
    <Button style={tw`self-center`} textColor={tw`text-primary-main`} ghost onPress={inviteFriend}>
      {i18n('referrals.inviteFriends')}
    </Button>
  )
}
