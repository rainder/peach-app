import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../../constants'
import { TradeInfoField } from '../../../../views/contract/helpers/tradeInformationGetters'
import {
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
} from '../templates'
import { GiftCardAmazon } from './GiftCardAmazon'
import { FormProps } from './PaymentMethodForm'

type PaymentMethodFormsType = {
  [key in PaymentMethod]?: { component: (props: FormProps) => JSX.Element; fields: TradeInfoField[] }
}

const sharedFields: TradeInfoField[] = ['method', 'price']

const template1Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'iban', 'bic', 'reference']
const template2Fields: TradeInfoField[] = [...sharedFields, 'wallet', 'email']
const template3Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'phone', 'reference']
const template4Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'email', 'reference']
const template5Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'ukBankAccount', 'ukSortCode', 'reference']
const template6Fields: TradeInfoField[] = [...sharedFields, 'userName', 'email', 'phone', 'reference']
const template7Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'accountNumber', 'reference']
const template8Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'phone', 'reference']
const template9Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'iban', 'accountNumber', 'bic', 'reference']

export const PaymentMethodForms: PaymentMethodFormsType = {
  sepa: { component: Template1, fields: template1Fields },
  fasterPayments: { component: Template5, fields: template5Fields },
  instantSepa: { component: Template1, fields: template1Fields },
  paypal: { component: Template6, fields: template6Fields },
  revolut: { component: Template6, fields: template6Fields },
  vipps: { component: Template3, fields: template3Fields },
  advcash: { component: Template2, fields: template2Fields },
  blik: { component: Template3, fields: template3Fields },
  wise: { component: Template6, fields: template6Fields },
  twint: { component: Template3, fields: template3Fields },
  swish: { component: Template3, fields: template3Fields },
  satispay: { component: Template3, fields: template3Fields },
  mbWay: { component: Template3, fields: template3Fields },
  bizum: { component: Template3, fields: template3Fields },
  mobilePay: { component: Template3, fields: template3Fields },
  skrill: { component: Template4, fields: template4Fields },
  neteller: { component: Template4, fields: template4Fields },
  paysera: { component: Template8, fields: template8Fields },
  straksbetaling: { component: Template7, fields: template7Fields },
  keksPay: { component: Template3, fields: template3Fields },
  friends24: { component: Template3, fields: template3Fields },
  n26: { component: Template6, fields: template6Fields },
  paylib: { component: Template3, fields: template3Fields },
  lydia: { component: Template3, fields: template3Fields },
  verse: { component: Template3, fields: template3Fields },
  iris: { component: Template3, fields: template3Fields },
  'giftCard.amazon': { component: GiftCardAmazon, fields: template4Fields },
}
GIFTCARDCOUNTRIES.forEach(
  (c) =>
    (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = {
      component: GiftCardAmazon,
      fields: template4Fields,
    }),
)
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) =>
    (PaymentMethodForms[`nationalTransfer${c}` as PaymentMethod] = { component: Template9, fields: template9Fields }),
)
