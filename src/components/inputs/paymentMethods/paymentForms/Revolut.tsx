import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Revolut = ({
  forwardRef,
  view,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [email, setEmail] = useState(data?.email || '')
  const anyFieldSet = !!(phone || userName || email)

  let $phone = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & RevolutData => ({
    id: data?.id || `revolut-${new Date().getTime()}`,
    label,
    type: 'revolut',
    phone,
    userName,
    email,
    currencies: data?.currencies || currencies,
  })

  const validateForm = () => validate({
    label: {
      required: true,
      duplicate: view === 'new' && getPaymentDataByLabel(label)
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

  const save = () => {
    if (!validateForm()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    validateForm,
    save,
  }))


  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, userName, email])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $phone?.focus()}
        value={label}
        disabled={view === 'view'}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={label.length && getErrorsInField('label')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={(number: string) => {
          setPhone((number.length && !/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
        }}
        onSubmit={() => {
          setPhone((number: string) => (!/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
          $userName?.focus()
        }}
        reference={(el: any) => $phone = el}
        value={phone}
        required={!anyFieldSet}
        disabled={view === 'view'}
        label={i18n('form.phone')}
        placeholder={i18n('form.phone.placeholder')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={phone.length && getErrorsInField('phone')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={(usr: string) => {
          setUserName(usr.length && !/@/ug.test(usr) ? `@${usr}` : usr)
        }}
        onSubmit={() => {
          setUserName((usr: string) => !/@/ug.test(usr) ? `@${usr}` : usr)
          $email?.focus()
        }}
        reference={(el: any) => $userName = el}
        value={userName}
        required={!anyFieldSet}
        disabled={view === 'view'}
        label={i18n('form.userName')}
        placeholder={i18n('form.userName.placeholder')}
        isValid={!isFieldInError('userName')}
        autoCorrect={false}
        errorMessage={userName.length && getErrorsInField('userName')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setEmail}
        onSubmit={save}
        reference={(el: any) => $email = el}
        value={email}
        required={!anyFieldSet}
        disabled={view === 'view'}
        label={i18n('form.email')}
        placeholder={i18n('form.email.placeholder')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={email.length && getErrorsInField('email')}
      />
    </View>
  </View>
}