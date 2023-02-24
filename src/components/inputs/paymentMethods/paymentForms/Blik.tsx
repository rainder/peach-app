import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const referenceRules = { required: false }
const phoneRules = { phone: true, isPhoneAllowed: true, required: true }

export const Blik = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
      required: true,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone])
  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = (): PaymentData & BlikData => ({
    id: data?.id || `vipps-${new Date().getTime()}`,
    label,
    type: 'blik',
    phone,
    currencies: selectedCurrencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors].length === 0
  }, [labelErrors, phoneErrors])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
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
      <PhoneInput
        onChange={setPhone}
        onSubmit={() => {
          $reference?.focus()
        }}
        value={phone}
        label={i18n('form.phone')}
        required={true}
        placeholder={i18n('form.phone.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? phoneErrors : undefined}
      />
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
      <CurrencySelection paymentMethod="blik" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
