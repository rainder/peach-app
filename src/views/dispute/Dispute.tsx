import React, { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, OptionButton, PeachScrollView, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { account } from '../../utils/account'
import { getContract, getContractViewer, getOfferHexIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'

import { PEACHPGPPUBLICKEY } from '../../constants'
import { MessageContext } from '../../contexts/message'
import { useHeaderSetup, useKeyboard, useNavigation, useRoute, useValidatedState } from '../../hooks'
import RaiseDisputeSuccess from '../../overlays/RaiseDisputeSuccess'
import { getChat, saveChat } from '../../utils/chat'
import { initDisputeSystemMessages } from '../../utils/chat/createDisputeSystemMessages'
import { error } from '../../utils/log'
import { raiseDispute } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp'

const disputeReasonsBuyer: DisputeReason[] = ['noPayment.buyer', 'unresponsive.buyer', 'abusive', 'other']
const disputeReasonsSeller: DisputeReason[] = ['noPayment.seller', 'unresponsive.seller', 'abusive', 'other']
export const isEmailRequired = (reason: DisputeReason | '') =>
  /noPayment|wrongPaymentAmount|satsNotReceived/u.test(reason)

const required = { required: true }

export default (): ReactElement => {
  const route = useRoute<'disputeReasonSelector'>()
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const keyboardOpen = useKeyboard()
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState(getContract(contractId))
  const [start, setStart] = useState(false)
  const [reason, setReason, reasonIsValid] = useValidatedState<DisputeReason | ''>('', required)
  const emailRules = useMemo(() => ({ email: isEmailRequired(reason), required: isEmailRequired(reason) }), [reason])
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState('', emailRules)
  const [message, setMessage, messageIsValid, messageErrors] = useValidatedState('', required)
  const [loading, setLoading] = useState(false)
  const [displayErrors, setDisplayErrors] = useState(false)
  let $message = useRef<TextInput>(null).current

  const view = contract ? getContractViewer(contract, account) : ''
  const availableReasons = view === 'seller' ? disputeReasonsSeller : disputeReasonsBuyer

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('dispute.disputeForTrade', !!contract ? getOfferHexIdFromContract(contract) : ''),
      }),
      [contract],
    ),
  )

  useEffect(() => {
    setContractId(route.params.contractId)
    setContract(getContract(route.params.contractId))
    setStart(false)
    setReason('')
    setMessage('')
    setLoading(false)
  }, [route, setMessage, setReason])

  const goBack = () => {
    if (reason) return setReason('')
    return setStart(false)
  }

  const submit = async () => {
    if (!contract?.symmetricKey) return
    setDisplayErrors(true)
    const isFormValid = reasonIsValid && emailIsValid && messageIsValid
    if (!isFormValid || !reason || !message) return
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
      updateMessage({
        msgKey: err?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
    }
    setLoading(false)
  }

  const reasonSelector = () => (
    <View style={tw`flex items-center`}>
      <Text style={tw`h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
      {availableReasons.map((rsn, i) => (
        <OptionButton key={rsn} onPress={() => setReason(rsn)} style={[tw`w-64`, i === 0 ? tw`mt-5` : tw`mt-2`]} narrow>
          {i18n(`dispute.reason.${rsn}`)}
        </OptionButton>
      ))}
    </View>
  )

  const disputeForm = () => (
    <View style={tw`flex items-center`}>
      <Text style={tw`px-4 text-center`}>{i18n('dispute.provideExplanation')}</Text>
      {isEmailRequired(reason) && (
        <View style={tw`mt-4`}>
          <Input
            onChange={setEmail}
            onSubmit={() => $message?.focus()}
            value={email}
            label={i18n('form.userEmail')}
            placeholder={i18n('form.userEmail.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        </View>
      )}
      <View style={tw`mt-4`}>
        <Input
          style={tw`h-40`}
          reference={(el: any) => ($message = el)}
          onChange={setMessage}
          value={message}
          multiline={true}
          label={i18n('form.message')}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? messageErrors : undefined}
        />
      </View>
    </View>
  )

  return (
    <View style={tw`flex-col items-center justify-between h-full px-6 pt-6 pb-10`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        {!reason ? reasonSelector() : disputeForm()}
      </PeachScrollView>
      {!reason ? (
        <PrimaryButton onPress={goBack} style={tw`mt-2`} narrow>
          {i18n('back')}
        </PrimaryButton>
      ) : (
        <PrimaryButton onPress={submit} loading={loading} disabled={loading} style={tw`mt-2`} narrow>
          {i18n('confirm')}
        </PrimaryButton>
      )}
    </View>
  )
}
