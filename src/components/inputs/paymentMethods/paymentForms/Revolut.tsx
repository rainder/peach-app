import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { validateForm } from '../../../../utils/validation'
import { useValidation } from '../../../../utils/validation/useValidation'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

// eslint-disable-next-line max-lines-per-function
export const Revolut = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [email, setEmail] = useState(data?.email || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const anyFieldSet = !!(phone || userName || email)

  let $phone = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current

  const { isFieldInError, getErrorsInField } = useValidation({ label, phone, userName, email })

  const buildPaymentData = (): PaymentData & RevolutData => ({
    id: data?.id || `revolut-${new Date().getTime()}`,
    label,
    type: 'revolut',
    phone,
    userName,
    email,
    currencies: selectedCurrencies,
  })

  const isFormValid = () =>
    validateForm([
      {
        value: label,
        rulesToCheck: {
          required: true,
          duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
        },
      },
      {
        value: phone,
        rulesToCheck: {
          required: !userName && !email,
          phone: true,
        },
      },
      {
        value: userName,
        rulesToCheck: {
          required: !phone && !email,
          userName: true,
        },
      },
      {
        value: email,
        rulesToCheck: {
          required: !userName && !phone,
          email: true,
        },
      },
    ])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    isFormValid,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, userName, email])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $phone?.focus()}
          value={label}
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
            setPhone((number.length && !/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
          }}
          onSubmit={() => {
            setPhone((number: string) => (!/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
            $userName?.focus()
          }}
          reference={(el: any) => ($phone = el)}
          value={phone}
          required={!anyFieldSet}
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
            setUserName(usr.length && !/@/gu.test(usr) ? `@${usr}` : usr)
          }}
          onSubmit={() => {
            setUserName((usr: string) => (!/@/gu.test(usr) ? `@${usr}` : usr))
            $email?.focus()
          }}
          reference={(el: any) => ($userName = el)}
          value={userName}
          required={!anyFieldSet}
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
          reference={(el: any) => ($email = el)}
          value={email}
          required={!anyFieldSet}
          label={i18n('form.email')}
          placeholder={i18n('form.email.placeholder')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={email.length && getErrorsInField('email')}
        />
      </View>
      <CurrencySelection paymentMethod="paypal" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
