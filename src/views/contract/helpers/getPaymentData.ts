import { decryptSymmetric, verify } from '../../../utils/pgp'

export const getPaymentData = async (contract: Contract): Promise<[PaymentData | null, Error | null]> => {
  let decryptedPaymentData: PaymentData | null = null

  if (!contract.symmetricKey) return [null, new Error('NO_SYMMETRIC_KEY')]
  if (contract.paymentData) return [contract.paymentData, null]
  if (!contract.paymentDataEncrypted || !contract.paymentDataSignature) return [null, new Error('MISSING_PAYMENTDATA')]

  let decryptedPaymentDataString
  try {
    decryptedPaymentDataString = await decryptSymmetric(contract.paymentDataEncrypted, contract.symmetricKey)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')]
  }
  try {
    if (!(await verify(contract.paymentDataSignature, decryptedPaymentDataString, contract.seller.pgpPublicKey))) {
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
  }

  return [decryptedPaymentData, null]
}
