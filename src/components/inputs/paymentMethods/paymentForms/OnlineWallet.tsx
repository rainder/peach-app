import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'

const phoneRules = { required: true, phone: true, isPhoneAllowed: true }
const referenceRules = { required: false }
// const beneficiaryRules = { required: false } and associated useValidatedState for vipps and blik and satispay
// vipps and blik didin't use validated state for phone
// blik was label => beneficiary => phone => reference

type OnlineWalletData = MBWayData | BizumData

export const OnlineWallet = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  name,
}: FormProps & { name: PaymentMethod }): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [displayErrors, setDisplayErrors] = useState(false)

  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current // not used in blik
  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & OnlineWalletData => ({
    id: data?.id || `${name}-${new Date().getTime()}`,
    label,
    type: name,
    phone,
    beneficiary,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid])

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
      {' '}
      {/** no view for swish*/}
      <View>
        {' '}
        {/** no view for swish*/}
        <Input
          onChange={setLabel}
          onSubmit={() => $phone?.focus()}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <View style={tw`mt-1`}>
        {' '}
        {/** no view for vipps and blik and swish and satispay */}
        <PhoneInput
          onChange={setPhone}
          onSubmit={() => {
            $beneficiary?.focus()
          }}
          reference={(el: any) => ($phone = el)}
          value={phone}
          // required={true} for mobilePay and vipps and blik
          label={i18n('form.phoneLong')} // form.phone for mobilePay and vipps and blik and twint and swish and satispay
          placeholder={i18n('form.phone.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? phoneErrors : undefined}
        />
      </View>
      <View style={tw`mt-1`}>
        {/** no view for vipps and blik and swish and satispay */}
        <Input
          onChange={setBeneficiary}
          onSubmit={() => {
            $reference?.focus()
          }}
          reference={(el: any) => ($beneficiary = el)}
          value={beneficiary}
          required={false}
          label={i18n('form.beneficiary')}
          placeholder={i18n('form.beneficiary.placeholder')}
          autoCorrect={false}
          // errorMessage={displayErrors ? beneficiaryError : undefined} for some
        />
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
    </View>
  )
}
