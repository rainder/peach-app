import { matchOffer } from '../../../utils/peachAPI'
import { generateMatchOfferData } from './generateMatchOfferData'
import { handleError } from './handleError'

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency: Currency | undefined,
  selectedPaymentMethod: PaymentMethod | undefined,
  updateMessage: (value: MessageState) => void,
  // eslint-disable-next-line max-params
) => {
  if (!offer?.id) throw new Error()
  if (!selectedCurrency || !selectedPaymentMethod) throw new Error('MISSING_VALUES')

  const [matchOfferData, dataError] = await generateMatchOfferData(offer, match, selectedCurrency, selectedPaymentMethod)
  if (!matchOfferData) throw new Error(dataError || 'UNKNOWN_ERROR')

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  handleError(err, updateMessage)
  throw new Error()
}
