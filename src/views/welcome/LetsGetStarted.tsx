import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { useState } from 'react'
import { Button } from '../../components/buttons/Button'
import { Input } from '../../components/inputs/Input'
import { useMessageState } from '../../components/message/useMessageState'
import { PeachText } from '../../components/text/PeachText'
import { useNavigation, useRoute, useValidatedState } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'

const referralCodeRules = { referralCode: true }
export const LetsGetStarted = () => {
  const route = useRoute<'welcome'>()
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const updateMessage = useMessageState((state) => state.updateMessage)
  const [referralCode, setReferralCode, referralCodeIsValid] = useValidatedState(
    route.params?.referralCode || '',
    referralCodeRules,
  )
  const [willUseReferralCode, setWillUseReferralCode] = useState(!!route.params?.referralCode)

  const updateReferralCode = (code: string) => {
    if (referralCode !== code) setWillUseReferralCode(false)
    setReferralCode(code)
  }

  const checkReferralCode = async () => {
    setWillUseReferralCode(false)
    const { result, error } = await peachAPI.public.user.checkReferralCode({ code: referralCode })
    if (!result || error) return showError(error?.error)
    setWillUseReferralCode(result.valid)
    return updateMessage({
      msgKey: result.valid ? 'referrals.myFavoriteCode' : 'referrals.codeNotFound',
      level: 'DEFAULT',
    })
  }

  const goToNewUser = () => {
    navigation.navigate('newUser', { referralCode: willUseReferralCode ? referralCode : undefined })
  }
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return (
    <View style={tw`items-center flex-1 gap-4 shrink`}>
      <View style={tw`justify-center gap-4 grow`}>
        <PeachText style={[tw`text-center h5 text-primary-background-light`, tw`md:h4`]}>
          {i18n('welcome.letsGetStarted.title')}
        </PeachText>

        <View>
          <PeachText style={tw`text-center text-primary-background-light`}>{i18n('newUser.referralCode')}</PeachText>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <View style={tw`h-14`}>
              <Input
                style={tw`w-40 mt-2`}
                theme="inverted"
                maxLength={16}
                placeholder={i18n('form.optional').toUpperCase()}
                onChange={updateReferralCode}
                onSubmit={updateReferralCode}
                value={referralCode}
                autoCapitalize="characters"
              />
            </View>
            <Button
              style={tw`min-w-20 bg-primary-background-light`}
              textColor={tw`text-primary-main`}
              disabled={willUseReferralCode || !referralCode || !referralCodeIsValid}
              onPress={checkReferralCode}
            >
              {i18n(willUseReferralCode ? 'referrals.used' : 'referrals.use')}
            </Button>
          </View>
        </View>
      </View>

      <View style={tw`gap-2`}>
        <Button
          onPress={goToNewUser}
          style={tw`bg-primary-background-light`}
          textColor={tw`text-primary-main`}
          iconId="plusCircle"
        >
          {i18n('newUser')}
        </Button>
        <Button onPress={goToRestoreBackup} iconId="save" ghost>
          {i18n('restore')}
        </Button>
      </View>
    </View>
  )
}
