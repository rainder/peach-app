import { account } from '../account'
import { hashPaymentData } from '../paymentMethod'

/**
 * @description Method to get payment data from offer by id
 * Use account payment data as fallback
 * @param offer the offer
 * @param paymentMethod payment method to get data for
 * @returns payment data or undefined
 */
export const getPaymentDataByMethod = (
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
): PaymentData | undefined => {
  const paymentData = offer.originalPaymentData
    ? offer.originalPaymentData.filter((data) => data.type === paymentMethod)
    : account.paymentData.filter((data) => data.type === paymentMethod)

  const paymentDataHashes = paymentData.map((data) => hashPaymentData(data))
  const index = paymentDataHashes.indexOf(offer.paymentData[paymentMethod]!.hash || '')

  return paymentData[index]
}
