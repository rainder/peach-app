import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import { WalletInput } from '../../WalletInput'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'wallet',
    display: i18n('form.wallet'),
  },
  {
    id: 'email',
    display: i18n('form.email'),
  },
]
const referenceRules = { required: false }

const useTemplate2Setup = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [wallet, setWallet] = useState(data?.wallet || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const anyFieldSet = !!email || !!wallet

  const labelRules = useMemo(
    () => ({
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
      required: true,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ email: true, required: !wallet }), [wallet])
  const walletRules = useMemo(() => ({ advcashWallet: true, required: !email }), [email])

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const walletErrors = useMemo(() => getErrorsInField(wallet, walletRules), [wallet, walletRules])
  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = useCallback(
    (): PaymentData & ADVCashData => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
      label,
      type: paymentMethod,
      wallet,
      email,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, email, label, paymentMethod, reference, selectedCurrencies, wallet],
  )

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...emailErrors, ...walletErrors].length === 0
  }, [emailErrors, labelErrors, walletErrors])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    currentTab,
    labelInputProps: {
      onChange: setLabel,
      value: label,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
    tabbedNavigationProps: {
      items: tabs,
      selected: currentTab,
      select: setCurrentTab,
    },
    walletInputProps: {
      onChange: setWallet,
      value: wallet,
      errorMessage: displayErrors ? walletErrors : undefined,
      required: !anyFieldSet,
    },
    emailInputProps: {
      onChange: setEmail,
      value: email,
      errorMessage: displayErrors ? emailErrors : undefined,
      required: !anyFieldSet,
    },
    referenceInputProps: {
      onChange: setReference,
      value: reference,
      errorMessage: displayErrors ? referenceError : undefined,
      onSubmit: save,
    },
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
  }
}

export const Template2 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const {
    currentTab,
    labelInputProps,
    tabbedNavigationProps,
    walletInputProps,
    emailInputProps,
    referenceInputProps,
    currencySelectionProps,
  } = useTemplate2Setup({ data, currencies, onSubmit, setStepValid, paymentMethod, setFormData })

  let $reference = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <TabbedNavigation {...tabbedNavigationProps} />
      <View style={tw`mt-2`}>
        {currentTab.id === 'wallet' && <WalletInput {...walletInputProps} onSubmit={$reference?.focus} />}
        {currentTab.id === 'email' && <EmailInput {...emailInputProps} onSubmit={$reference?.focus} />}
      </View>
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      <CurrencySelection {...currencySelectionProps} />
    </View>
  )
}
