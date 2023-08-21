import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, LabelInput, PhoneInput, ReferenceInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate3Setup } from './hooks'

export const Template3 = (props: FormProps) => {
  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    phoneInputProps,
    beneficiaryInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate3Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $phone?.focus()} />
      <PhoneInput {...phoneInputProps} onSubmit={() => $beneficiary?.focus()} reference={(el) => ($phone = el)} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el) => ($beneficiary = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
