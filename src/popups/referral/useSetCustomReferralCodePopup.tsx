import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { Input, Text } from '../../components'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { useNavigation, useValidatedState } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { redeemReferralCode } from '../../utils/peachAPI'
import { ClosePopupAction } from '../actions'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSuccess'

export const useSetCustomReferralCodePopup = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showCustomReferralCodePopup = useCallback(() => {
    setPopup(<CustomReferralCodePopup />)
  }, [setPopup])

  return showCustomReferralCodePopup
}

function CustomReferralCodePopup () {
  const setPopup = usePopupStore((state) => state.setPopup)
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [referralCodeTaken, setReferralCodeTaken] = useState(false)
  const referralCodeRules = useMemo(
    () => ({ required: true, referralCode: true, referralCodeTaken }),
    [referralCodeTaken],
  )

  const [referralCode, setReferralCode, referralCodeValid, referralCodeErrors] = useValidatedState<string>(
    '',
    referralCodeRules,
  )

  const updateReferralCode = useCallback(
    (code: string) => {
      setReferralCode(code)
      setReferralCodeTaken(false)
    },
    [setReferralCode],
  )

  const submitCustomReferralCode = useCallback(async () => {
    const [, redeemError] = await redeemReferralCode({ code: referralCode })

    if (redeemError?.error === 'ALREADY_TAKEN') {
      setReferralCodeTaken(true)
      return
    }
    if (redeemError) {
      showErrorBanner(redeemError.error)
      return
    }
    setPopup({
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCodeSuccess {...{ referralCode }} />,
      level: 'APP',
      visible: true,
    })
    navigation.replace('referrals')
  }, [navigation, referralCode, showErrorBanner, setPopup])

  return (
    <PopupComponent
      title={i18n('settings.referrals.customReferralCode.popup.title')}
      content={
        <View style={tw`gap-3`}>
          <Text>{i18n('settings.referrals.customReferralCode.popup.text')}</Text>
          <Input
            style={tw`bg-primary-background-dark`}
            placeholder={i18n('form.referral.placeholder')}
            value={referralCode}
            onChange={updateReferralCode}
            autoCapitalize="characters"
            errorMessage={referralCodeErrors}
          />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={i18n('settings.referrals.customReferralCode.popup.redeem')}
            iconId="checkSquare"
            onPress={submitCustomReferralCode}
            disabled={!referralCodeValid}
            reverseOrder
          />
        </>
      }
    />
  )
}
