import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Pressable, View } from 'react-native'
import { FormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Headline, Text } from '../../../text'
import cashAmsterdam from './assets/cash.amsterdam.svg'

export const CashAmsterdam = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
}: FormProps): ReactElement => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(data?.disclaimerAcknowledged || false)
  const Banner = cashAmsterdam

  const buildPaymentData = (): PaymentData & CashData => ({
    id: data?.id || 'cash.amsterdam',
    label: 'Cash in Amsterdam!',
    type: 'cash.amsterdam',
    disclaimerAcknowledged,
    currencies: data?.currencies || currencies,
  })

  const acknowledge = () => setDisclaimerAcknowledged(true)
  const isFormValid = () => disclaimerAcknowledged
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
    <View style={tw`flex items-center bg-[#FF9500] pb-10`}>
      <Headline style={tw`text-3xl text-white-1 leading-3xl mt-14`}>
        {i18n('paymentMethod.cash.amsterdam.title')}
      </Headline>
      {<Banner style={{ marginTop: -43 }} />}

      <View style={tw`mt-20`}>
        <Text style={tw`text-center text-black-1`}>{i18n('paymentMethod.cash.amsterdam.1')}</Text>
        <Text style={tw`mt-1 text-center text-black-1`}>{i18n('paymentMethod.cash.2')}</Text>
        <Text style={tw`mt-1 text-center text-black-1`}>{i18n('paymentMethod.cash.3')}</Text>
      </View>
      <Pressable onPress={acknowledge} style={tw`flex flex-row items-center justify-between mt-10`}>
        <View style={tw`flex items-center justify-center w-5 h-5 ml-4`}>
          {disclaimerAcknowledged ? (
            <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-white-1`.color} />
          ) : (
            <View style={tw`w-4 h-4 border-2 rounded-sm border-grey-2`} />
          )}
        </View>
        <Text style={tw`flex-shrink pl-7 text-black-1`}>{i18n('paymentMethod.cash.checkbox')}</Text>
      </Pressable>
    </View>
  )
}
