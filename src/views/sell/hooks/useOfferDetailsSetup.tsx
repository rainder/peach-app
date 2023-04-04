import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { shallow } from 'zustand/shallow'
import { Icon } from '../../../components'
import { EditIcon, HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useShowHelp, useToggleBoolean } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getPaymentData, getSelectedPaymentDataIds } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { hashPaymentData } from '../../../utils/paymentMethod'
import { validateOfferDetailsStep } from '../helpers/validateOfferDetailsStep'

type Props = {
  offerDraft: SellOfferDraft
  setOfferDraft: Dispatch<SetStateAction<SellOfferDraft>>
}
export const useOfferDetailsSetup = ({ offerDraft, setOfferDraft }: Props) => {
  const [isEditing, toggleIsEditing] = useToggleBoolean(false)
  const [meansOfPayment, setMeansOfPayment, preferredPaymentMethods] = useSettingsStore(
    (state) => [state.meansOfPayment, state.setMeansOfPayment, state.preferredPaymentMethods],
    shallow,
  )
  const [isStepValid, setIsStepValid] = useState(false)

  const showHelp = useShowHelp('paymentMethods')

  useHeaderSetup({
    title: i18n(isEditing ? 'paymentMethods.edit.title' : 'paymentMethods.title'),
    icons:
      account.paymentData.length !== 0
        ? [
          {
            iconComponent: isEditing ? <Icon id="checkboxMark" /> : <EditIcon />,
            onPress: toggleIsEditing,
          },
          { iconComponent: <HelpIcon />, onPress: showHelp },
        ]
        : [{ iconComponent: <HelpIcon />, onPress: showHelp }],
  })

  useEffect(() => {
    const paymentData = getSelectedPaymentDataIds(preferredPaymentMethods)
      .map(getPaymentData)
      .reduce((obj, data) => {
        if (!data) return obj
        obj[data.type] = {
          hash: hashPaymentData(data),
          country: data.country,
        }
        return obj
      }, {} as Offer['paymentData'])
    setOfferDraft((prev) => ({
      ...prev,
      meansOfPayment,
      originalPaymentData: getSelectedPaymentDataIds(preferredPaymentMethods).map(getPaymentData) as PaymentData[],
      paymentData,
    }))
  }, [meansOfPayment, preferredPaymentMethods, setOfferDraft])

  useEffect(
    () => setIsStepValid(validateOfferDetailsStep(offerDraft, preferredPaymentMethods)),
    [offerDraft, preferredPaymentMethods],
  )

  return { paymentData: account.paymentData, setMeansOfPayment, isEditing, toggleIsEditing, isStepValid }
}
