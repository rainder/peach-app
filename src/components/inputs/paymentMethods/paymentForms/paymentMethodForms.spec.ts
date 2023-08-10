/* eslint-disable max-lines-per-function */
import { PaymentMethodForms } from '../paymentForms/paymentMethodForms'
import {
  Template1,
  Template10,
  Template11,
  Template12,
  Template13,
  Template14,
  Template15,
  Template16,
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

describe('paymentMethodForms', () => {
  it('should assign the correct template to each payment method', () => {
    expect(PaymentMethodForms).toStrictEqual({
      sepa: { component: Template1, fields: expect.any(Array) },
      fasterPayments: { component: Template5, fields: expect.any(Array) },
      instantSepa: { component: Template1, fields: expect.any(Array) },
      paypal: { component: Template6, fields: expect.any(Array) },
      revolut: { component: Template6, fields: expect.any(Array) },
      vipps: { component: Template3, fields: expect.any(Array) },
      advcash: { component: Template2, fields: expect.any(Array) },
      blik: { component: Template3, fields: expect.any(Array) },
      wise: { component: Template6, fields: expect.any(Array) },
      twint: { component: Template3, fields: expect.any(Array) },
      swish: { component: Template3, fields: expect.any(Array) },
      satispay: { component: Template3, fields: expect.any(Array) },
      mbWay: { component: Template3, fields: expect.any(Array) },
      bizum: { component: Template3, fields: expect.any(Array) },
      mobilePay: { component: Template3, fields: expect.any(Array) },
      skrill: { component: Template4, fields: expect.any(Array) },
      neteller: { component: Template4, fields: expect.any(Array) },
      paysera: { component: Template8, fields: expect.any(Array) },
      straksbetaling: { component: Template7, fields: expect.any(Array) },
      keksPay: { component: Template3, fields: expect.any(Array) },
      friends24: { component: Template3, fields: expect.any(Array) },
      n26: { component: Template6, fields: expect.any(Array) },
      paylib: { component: Template3, fields: expect.any(Array) },
      lydia: { component: Template3, fields: expect.any(Array) },
      verse: { component: Template3, fields: expect.any(Array) },
      iris: { component: Template3, fields: expect.any(Array) },
      'giftCard.amazon': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.DE': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.ES': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.FI': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.FR': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.IT': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.NL': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.SE': { component: GiftCardAmazon, fields: expect.any(Array) },
      'giftCard.amazon.UK': { component: GiftCardAmazon, fields: expect.any(Array) },
      nationalTransferBE: { component: Template9, fields: expect.any(Array) },
      nationalTransferBG: { component: Template9, fields: expect.any(Array) },
      nationalTransferCA: { component: Template9, fields: expect.any(Array) },
      nationalTransferCH: { component: Template9, fields: expect.any(Array) },
      nationalTransferCY: { component: Template9, fields: expect.any(Array) },
      nationalTransferCZ: { component: Template9, fields: expect.any(Array) },
      nationalTransferDE: { component: Template9, fields: expect.any(Array) },
      nationalTransferDK: { component: Template9, fields: expect.any(Array) },
      nationalTransferES: { component: Template9, fields: expect.any(Array) },
      nationalTransferFI: { component: Template9, fields: expect.any(Array) },
      nationalTransferFR: { component: Template9, fields: expect.any(Array) },
      nationalTransferGB: { component: Template9, fields: expect.any(Array) },
      nationalTransferGR: { component: Template9, fields: expect.any(Array) },
      nationalTransferHU: { component: Template9, fields: expect.any(Array) },
      nationalTransferIT: { component: Template9, fields: expect.any(Array) },
      nationalTransferNL: { component: Template9, fields: expect.any(Array) },
      nationalTransferNO: { component: Template9, fields: expect.any(Array) },
      nationalTransferPL: { component: Template9, fields: expect.any(Array) },
      nationalTransferPO: { component: Template9, fields: expect.any(Array) },
      nationalTransferPT: { component: Template9, fields: expect.any(Array) },
      nationalTransferRO: { component: Template9, fields: expect.any(Array) },
      nationalTransferSE: { component: Template9, fields: expect.any(Array) },
      nationalTransferSI: { component: Template9, fields: expect.any(Array) },
      nationalTransferUS: { component: Template9, fields: expect.any(Array) },
      liquid: { component: Template10, fields: ['method', 'price', 'receiveAddress'] },
      lnurl: { component: Template11, fields: ['method', 'price', 'lnurlAddress'] },
      rappipay: { component: Template12, fields: ['method', 'price', 'phone'] },
      mercadoPago: { component: Template13, fields: ['method', 'price', 'phone', 'email'] },
      nequi: { component: Template3, fields: ['method', 'price', 'beneficiary', 'phone', 'reference'] },
      cbu: { component: Template14, fields: ['method', 'price', 'beneficiary', 'accountNumber'] },
      cvu: { component: Template15, fields: ['method', 'price', 'beneficiary', 'accountNumber'] },
      alias: { component: Template16, fields: ['method', 'price', 'beneficiary', 'accountNumber'] },
    })
  })
})
