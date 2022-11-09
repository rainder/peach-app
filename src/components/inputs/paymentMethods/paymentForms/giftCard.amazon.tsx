import React, { ReactElement, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import { OverlayContext } from '../../../../contexts/overlay'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { validateForm } from '../../../../utils/validation'
import { useValidation } from '../../../../utils/validation/useValidation'
import Input from '../../Input'

// eslint-disable-next-line max-lines-per-function
export const GiftCardAmazon = ({
  forwardRef,
  data,
  currencies = [],
  country,
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')

  let $email = useRef<TextInput>(null).current

  const { isFieldInError, getErrorsInField } = useValidation({ label, email })

  const buildPaymentData = (): PaymentData & AmazonGiftCardData => ({
    id: data?.id || `giftCard.amazon-${new Date().getTime()}`,
    label,
    type: `giftCard.amazon.${data?.country || country}` as PaymentMethod,
    email,
    currencies: data?.currencies || currencies,
    country: data?.country || country,
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
        value: email,
        rulesToCheck: {
          required: true,
          email: true,
        },
      },
    ])
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
  }, [label, email])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $email?.focus()}
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
          onChange={setEmail}
          onSubmit={save}
          reference={(el: any) => ($email = el)}
          required={true}
          value={email}
          label={i18n('form.email')}
          placeholder={i18n('form.email.placeholder')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={email.length && getErrorsInField('email')}
        />
      </View>
    </View>
  )
}
