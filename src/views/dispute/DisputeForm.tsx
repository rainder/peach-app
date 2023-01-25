import React, { ReactElement, useContext, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, PeachScrollView, PrimaryButton } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { account } from '../../utils/account'
import { getContract, getOfferHexIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'

import { PEACHPGPPUBLICKEY } from '../../constants'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../hooks'
import RaiseDisputeSuccess from '../../overlays/RaiseDisputeSuccess'
import { error } from '../../utils/log'
import { raiseDispute } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp'
import { getChat, saveChat } from '../../utils/chat'
import { initDisputeSystemMessages } from '../../utils/chat/createDisputeSystemMessages'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'

export const isEmailRequired = (reason: DisputeReason | '') => /noPayment.buyer|noPayment.seller/u.test(reason)
const required = { required: true }

export default (): ReactElement => {
  const route = useRoute<'disputeForm'>()
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const reason = route.params.reason
  const contractId = route.params.contractId
  const [contract, setContract] = useState(getContract(contractId))

  const emailRules = useMemo(() => ({ email: isEmailRequired(reason), required: isEmailRequired(reason) }), [reason])
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState('', emailRules)
  const [message, setMessage, messageIsValid, messageErrors] = useValidatedState('', required)
  const [loading, setLoading] = useState(false)
  let $message = useRef<TextInput>(null).current

  const showError = useShowErrorBanner()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('dispute.disputeForTrade', !!contract ? getOfferHexIdFromContract(contract) : ''),
      }),
      [contract],
    ),
  )

  const submit = async () => {
    if (!contract?.symmetricKey || !emailIsValid || !messageIsValid || !reason || !message) return
    setLoading(true)

    const { encrypted: symmetricKeyEncrypted } = await signAndEncrypt(contract.symmetricKey, PEACHPGPPUBLICKEY)

    const [result, err] = await raiseDispute({
      contractId,
      email,
      reason,
      message,
      symmetricKeyEncrypted,
    })
    if (result) {
      const updatedContract = {
        ...contract,
        disputeDate: new Date(Date.now()),
        disputeInitiator: account.publicKey,
      }
      setContract(updatedContract)
      const chat = getChat(contractId)
      const autogeneratedMessages = initDisputeSystemMessages(chat.id, updatedContract)
      saveChat(contractId, {
        messages: autogeneratedMessages,
      })

      Keyboard.dismiss()
      updateOverlay({
        content: <RaiseDisputeSuccess />,
        visible: true,
      })
      setTimeout(() => {
        navigation.navigate('contract', { contractId })
        updateOverlay({ visible: false })
      }, 3000)
      setLoading(false)

      return
    }

    if (err) {
      error('Error', err)
      showError()
    }
    setLoading(false)
  }

  const DisputeForm = (): ReactElement => (
    <>
      <View style={tw`justify-center h-full p-6 pb-20`}>
        {isEmailRequired(reason) && (
          <Input
            onChange={setEmail}
            onSubmit={() => $message?.focus()}
            value={email}
            placeholder={i18n('form.userEmail.placeholder')}
            autoCorrect={false}
            errorMessage={emailErrors}
          />
        )}
        <Input value={i18n(`dispute.reason.${reason}`)} disabled />
        <Input
          style={tw`h-40`}
          reference={(el: any) => ($message = el)}
          onChange={setMessage}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={messageErrors}
        />
      </View>
      <PrimaryButton
        onPress={submit}
        loading={loading}
        disabled={loading || !emailIsValid || !messageIsValid}
        style={tw`absolute self-center bottom-8`}
        narrow
      >
        {i18n('confirm')}
      </PrimaryButton>
    </>
  )

  return (
    <View style={tw`flex-col items-center justify-between h-full px-6 pt-6 pb-10`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        <DisputeForm />
      </PeachScrollView>
      <PrimaryButton onPress={submit} loading={loading} disabled={loading} style={tw`mt-2`} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
