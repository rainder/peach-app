import { DetailNationalTransfer } from './detail/nationalTransfer'
import { NATIONALTRANSFERCOUNTRIES } from './../../constants'
import { DetailMobilePay } from './detail/mobilePay'
import { DetailVipps } from './detail/vipps'
import { DetailFasterPayments } from './detail/fasterPayments'
import { DetailInstantSepa } from './detail/instantSepa'
import { ReactElement } from 'react'
import { GIFTCARDCOUNTRIES } from '../../constants'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailPaypal from './detail/paypal'
import DetailRevolut from './detail/revolut'
import { DetailSEPA } from './detail/sepa'
import DetailADVCash from './detail/advcash'
import DetailBlik from './detail/blik'

export type PaymentTemplateProps = ComponentProps & {
  paymentData: PaymentData
  country?: PaymentMethodCountry
  appLink?: string
  fallbackUrl?: string
  userLink?: string
  copyable?: boolean
}

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  sepa: DetailSEPA,
  fasterPayments: DetailFasterPayments,
  instantSepa: DetailInstantSepa,
  paypal: DetailPaypal,
  revolut: DetailRevolut,
  advcash: DetailADVCash,
  blik: DetailBlik,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  mobilePay: DetailMobilePay,
  vipps: DetailVipps,
  'giftCard.amazon': GeneralPaymentDetails,
}

GIFTCARDCOUNTRIES.forEach(
  (c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails),
)
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (paymentDetailTemplates[('nationalTransfer' + c) as PaymentMethod] = DetailNationalTransfer),
)
