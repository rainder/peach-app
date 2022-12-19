import i18n from '../../../utils/i18n'

import { getPaymentDataByType } from '../../../utils/account'
import { error } from '../../../utils/log'
import { StackNavigation } from '../../../utils/navigation'
import React from 'react'
import { PaymentDataMissing } from '../../../messageBanners/PaymentDataMissing'

export const handleMissingPaymentData = (
  offer: BuyOffer | SellOffer,
  currency: Currency,
  paymentMethod: PaymentMethod,
  updateMessage: (value: MessageState) => void,
  navigation: StackNavigation,
  // eslint-disable-next-line max-params
) => {
  error('Payment data could not be found for offer', offer.id)
  const openAddPaymentMethodDialog = () => {
    updateMessage({ template: null, level: 'ERROR' })
    const existingPaymentMethodsOfType = getPaymentDataByType(paymentMethod).length + 1
    const label = i18n(`paymentMethod.${paymentMethod}`) + ' #' + existingPaymentMethodsOfType

    navigation.push('paymentDetails', {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [currency],
        country: /giftCard/u.test(paymentMethod) ? (paymentMethod.split('.').pop() as Country) : undefined,
      },
      origin: ['search', {}],
    })
  }

  updateMessage({
    template: <PaymentDataMissing {...{ openAddPaymentMethodDialog }} />,
    level: 'ERROR',
  })
}
