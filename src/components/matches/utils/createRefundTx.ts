import { checkRefundPSBT, signPSBT } from '../../../utils/bitcoin'
import { patchOffer } from '../../../utils/peachAPI'

export const createRefundTx = async (offer: SellOffer, refundTx: string): Promise<string | undefined> => {
  let currentRefundTx = offer.refundTx
  const { isValid, psbt } = checkRefundPSBT(refundTx, offer)
  if (isValid && psbt) {
    const signedPSBT = signPSBT(psbt, offer, false)
    const [patchOfferResult] = await patchOffer({
      offerId: offer.id,
      refundTx: signedPSBT.toBase64(),
    })
    if (patchOfferResult) currentRefundTx = psbt.toBase64()
  }
  return currentRefundTx
}
