import { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useToggleBoolean, useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { BICInput } from '../../BICInput'
import { Checkbox } from '../../Checkbox'
import { IBANInput } from '../../IBANInput'
import Input from '../../Input'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ibanRules = { required: true, iban: true, isEUIBAN: true }
const bicRules = { required: true, bic: true }

export const InstantSepa = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [checked, toggleChecked] = useToggleBoolean(!!data.id)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [iban, setIBAN, ibanIsValid, ibanErrors] = useValidatedState(data?.iban || '', ibanRules)
  const [bic, setBIC, bicIsValid, bicErrors] = useValidatedState(data?.bic || '', bicRules)
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    notRequired,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & SEPAData => ({
    id: data?.id || `instantSepa-${new Date().getTime()}`,
    label,
    type: 'instantSepa',
    beneficiary,
    iban,
    bic,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && ibanIsValid && bicIsValid && referenceIsValid && checked
  }, [beneficiaryIsValid, bicIsValid, checked, ibanIsValid, labelErrors.length, referenceIsValid])

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
    <>
      <Input
        onChange={setLabel}
        onSubmit={() => $beneficiary?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <Input
        onChange={setBeneficiary}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => ($beneficiary = el)}
        required={true}
        value={beneficiary}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <IBANInput
        onChange={setIBAN}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => ($iban = el)}
        required={true}
        value={iban}
        label={i18n('form.iban')}
        placeholder={i18n('form.iban.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? ibanErrors : undefined}
      />
      <BICInput
        onChange={setBIC}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($bic = el)}
        value={bic}
        required={true}
        label={i18n('form.bic')}
        placeholder={i18n('form.bic.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? bicErrors : undefined}
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
        errorMessage={displayErrors ? referenceErrors : undefined}
      />
      <Checkbox checked={checked} onPress={toggleChecked} text={i18n('form.instantSepa.checkbox')} />
    </>
  )
}
