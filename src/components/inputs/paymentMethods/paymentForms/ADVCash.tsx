import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

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

export const ADVCash = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [wallet, setWallet] = useState(data?.wallet || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const anyFieldSet = !!email || !!wallet

  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
      required: true,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ email: true, required: !wallet }), [wallet])
  const walletRules = useMemo(() => ({ required: !email }), [email]) // TODO RULES

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const walletErrors = useMemo(() => getErrorsInField(wallet, walletRules), [wallet, walletRules])
  const [displayErrors, setDisplayErrors] = useState(false)

  const handleWalletSubmit = (text: string) => {
    // Remove any spaces from the entered text
    const formattedText = text.replace(/\s/u, '')
    // Add spaces at the appropriate positions
    const formattedValue = formattedText
      .toUpperCase()
      .replace(/^([A-Z])/u, '$1 ') // Add space after first letter
      .replace(/([A-Za-z\d]{4})?([A-Za-z\d]{4})/u, '$1 $2 ') // Add space after every 4 digits
    setWallet(formattedValue)
  }

  const buildPaymentData = (): PaymentData & ADVCashData => ({
    id: data?.id || `advcash-${new Date().getTime()}`,
    label,
    type: 'advcash',
    wallet,
    email,
    currencies: selectedCurrencies,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return [...labelErrors, ...emailErrors, ...walletErrors].length === 0
  }

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
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      <View style={tw`mt-2`}>
        {currentTab.id === 'wallet' && (
          // TODO : Wallet input
          <Input
            onChange={setWallet}
            onSubmit={$reference?.focus}
            onBlur={() => {
              handleWalletSubmit(wallet)
            }}
            value={wallet}
            required={!anyFieldSet}
            placeholder={i18n('form.wallet.placeholder')}
            errorMessage={displayErrors ? walletErrors : undefined}
          />
        )}
        {currentTab.id === 'email' && (
          <EmailInput
            onChange={setEmail}
            onSubmit={$reference?.focus}
            value={email}
            required={!anyFieldSet}
            placeholder={i18n('form.email.placeholder')}
            errorMessage={displayErrors ? emailErrors : undefined}
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
      <CurrencySelection paymentMethod="advcash" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
