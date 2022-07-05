import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { SellViewProps } from './Sell'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../utils/account'
import PaymentDetails from './components/PaymentDetails'
import Premium from './components/Premium'
import KYC from './components/KYC'
import i18n from '../../utils/i18n'
import { Headline, Title } from '../../components'
import { hasMopsConfigured } from '../../utils/offer'
import { getPaymentMethods, isValidPaymentdata } from '../../utils/paymentMethod'
import AddPaymentMethods from '../../components/payment/AddPaymentMethods'

const validate = (offer: SellOffer) => {
  const paymentMethods = getPaymentMethods(offer.meansOfPayment)
  const selectedPaymentMethods = Object.keys(offer.paymentData)
  const paymentDataValid = getSelectedPaymentDataIds()
    .map(getPaymentData)
    .filter(d => d)
    .every(d => isValidPaymentdata(d!))

  return !!offer.amount
    && hasMopsConfigured(offer)
    && selectedPaymentMethods.length > 0
    && paymentMethods.every(p => offer.paymentData[p])
    && paymentDataValid
}

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(
    offer.meansOfPayment || account.settings.meansOfPayment
  )
  const [premium, setPremium] = useState(offer.premium)
  const [paymentData, setPaymentData] = useState(offer.paymentData)
  const [kyc, setKYC] = useState(offer.kyc)
  const [kycType, setKYCType] = useState(offer.kycType)

  const saveAndUpdate = (offr: SellOffer, shield = true) => {
    updateOffer(offr, shield)
    updateSettings({
      meansOfPayment: offr.meansOfPayment,
      premium: offr.premium,
      kyc: offr.kyc,
      kycType: offr.kycType,
    })
  }

  useEffect(() => {
    saveAndUpdate({
      ...offer,
      meansOfPayment,
      paymentData,
      premium,
      kyc,
      kycType,
    }, false)
  }, [meansOfPayment, premium, paymentData, kyc, kycType])

  useEffect(() => setStepValid(validate(offer)), [offer])

  const onPaymentMethodAdded = () => {
    saveAndUpdate({ ...offer })
  }

  return <View style={tw`mb-16 px-6`}>
    <Title title={i18n('sell.title')} />
    <Headline style={tw`mt-16 text-grey-1`}>
      {i18n('sell.meansOfPayment')}
    </Headline>
    <PaymentDetails
      paymentData={account.paymentData}
      setPaymentData={setPaymentData}
      setMeansOfPayment={setMeansOfPayment}
    />
    <AddPaymentMethods style={tw`mt-4`} onUpdate={onPaymentMethodAdded} view="seller" />

    <Premium
      premium={premium}
      setPremium={setPremium}
      offer={offer}
    />
    {/* <KYC kyc={kyc} setKYC={setKYC} kycType={kycType} setKYCType={setKYCType} /> */}
  </View>
}