import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import tw from '../../../../styles/tailwind'
import { addPaymentData, getPaymentData, removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Revolut: PaymentMethodForm = ({ style, view, data, onSubmit, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [id, setId] = useState(data?.id || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [email, setEmail] = useState(data?.email || '')
  const anyFieldSet = !!(phone || userName || email)
  let $id = useRef<TextInput>(null).current
  let $phone = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { id, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      id: {
        required: true,
        duplicate: view === 'new' && getPaymentData(id)
      },
      phone: {
        required: !userName && !email,
        phone: true
      },
      userName: {
        required: !phone && !email,
        userName: true
      },
      email: {
        required: !userName && !phone,
        email: true
      },
    })
    if (!isFormValid()) return

    if (view === 'edit') removePaymentData(data?.id || '')

    const paymentData: PaymentData & RevolutData = {
      id,
      type: 'revolut',
      phone,
      userName,
      email,
    }
    addPaymentData(paymentData)
    if (onSubmit) onSubmit(paymentData)
  }

  const remove = () => {
    removePaymentData(data?.id || '')
    if (onSubmit) onSubmit()
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
    $id?.focus()
  }, [])

  return <View style={style}>
    <View style={[tw`mt-32`, tw.md`mt-40`]}>
      <View>
        <Input
          onChange={setId}
          onSubmit={() => $phone?.focus()}
          reference={(el: any) => $id = el}
          value={id}
          disabled={view === 'view'}
          label={i18n('form.paymentMethodName')}
          isValid={!isFieldInError('id')}
          autoCorrect={false}
          errorMessage={getErrorsInField('id')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setPhone}
          onSubmit={() => $userName?.focus()}
          reference={(el: any) => $phone = el}
          value={phone}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.phone')}
          isValid={!isFieldInError('phone')}
          autoCorrect={false}
          errorMessage={getErrorsInField('phone')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setUserName}
          onSubmit={() => {
            setUserName((user: string) => !/@/ug.test(userName) ? `@${userName}` : user)
            $email?.focus()
          }}
          reference={(el: any) => $userName = el}
          value={userName}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.userName')}
          isValid={!isFieldInError('paymentLink')}
          autoCorrect={false}
          errorMessage={getErrorsInField('paymentLink')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setEmail}
          onSubmit={save}
          reference={(el: any) => $email = el}
          value={email}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.email')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={getErrorsInField('email')}
        />
      </View>
    </View>
    {view !== 'view'
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={onCancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('form.paymentMethod.add')}
          secondary={true}
          wide={false}
          onPress={save}
        />
        {view === 'edit'
          ? <Pressable onPress={remove} style={tw`mt-6`}>
            <Text style={tw`font-baloo text-sm text-center underline text-white-1`}>
              {i18n('form.paymentMethod.remove')}
            </Text>
          </Pressable>
          : null
        }
      </Fade>
      : null
    }
  </View>
}