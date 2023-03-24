import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'
import { UsernameInput } from '../../UsernameInput'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'phone',
    display: i18n('form.phone'),
  },
  {
    id: 'email',
    display: i18n('form.email'),
  },
  {
    id: 'userName',
    display: i18n('form.userName'),
  },
]
const referenceRules = { required: false }

// eslint-disable-next-line max-statements
export const PayPal = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ required: !phone && !userName, email: true }), [phone, userName])
  const userNameRules = useMemo(() => ({ required: !phone && !email, paypalUserName: true }), [email, phone])
  const phoneRules = useMemo(
    () => ({ phone: true, isPhoneAllowed: true, required: !userName && !email }),
    [email, userName],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const userNameErrors = useMemo(() => getErrorsInField(userName, userNameRules), [userName, userNameRules])

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id: data?.id || `paypal-${Date.now()}`,
    label,
    type: 'paypal',
    phone,
    email,
    userName,
    reference,
    currencies: selectedCurrencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors, ...emailErrors, ...userNameErrors].length === 0
  }, [emailErrors, labelErrors, phoneErrors, userNameErrors])

  const getErrorTabs = () => {
    const fields = []
    if (phone && phoneErrors.length > 0) fields.push('phone')
    if (email && emailErrors.length > 0) fields.push('email')
    if (userName && userNameErrors.length > 0) fields.push('userName')
    return fields
  }

  const save = () => {
    if (!isFormValid()) return
    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <TabbedNavigation
        items={tabs}
        selected={currentTab}
        select={setCurrentTab}
        buttonStyle={tw`p-0`}
        tabHasError={displayErrors ? getErrorTabs() : []}
      />
      <View style={tw`mt-2`}>
        {currentTab.id === 'phone' && (
          <PhoneInput
            onChange={setPhone}
            onSubmit={() => {
              $reference?.focus()
            }}
            value={phone}
            label={i18n('form.phoneLong')}
            placeholder={i18n('form.phone.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? phoneErrors : undefined}
          />
        )}
        {currentTab.id === 'email' && (
          <EmailInput
            onChange={setEmail}
            onSubmit={() => $reference?.focus()}
            value={email}
            label={i18n('form.emailLong')}
            placeholder={i18n('form.email.placeholder')}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        )}
        {currentTab.id === 'userName' && (
          <UsernameInput
            {...{
              maxLength: 21,
              onChange: setUserName,
              onSubmit: $reference?.focus,
              value: userName,
              placeholder: i18n('form.userName.placeholder'),
              label: i18n('form.userName'),
              autoCorrect: false,
              errorMessage: displayErrors ? userNameErrors : undefined,
            }}
          />
        )}
      </View>

      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? referenceError : undefined}
      />
      <CurrencySelection paymentMethod="paypal" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
