import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { OfferRepublished } from '../../../popups/tradeCancelation'
import { usePopupStore } from '../../../store/usePopupStore'
import { getSellOfferFromContract, saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { reviveSellOffer } from '../../../utils/peachAPI'

export const useRepublishOffer = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showErrorBanner = useShowErrorBanner()
  const navigation = useNavigation()

  const confirmOverlay = useCallback(
    (contract: Contract) => {
      closePopup()
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closePopup],
  )

  const republishOffer = useCallback(
    async (contract: Contract) => {
      const sellOffer = getSellOfferFromContract(contract)

      const [reviveSellOfferResult, err] = await reviveSellOffer({ offerId: sellOffer.id })
      if (!reviveSellOfferResult || err) {
        showErrorBanner(err?.error)
        closePopup()
        return
      }

      const closeAction = () => {
        navigation.replace('contract', { contractId: contract.id })
        confirmOverlay(contract)
      }
      const goToOfferAction = () => {
        navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
        confirmOverlay(contract)
      }

      setPopup({
        title: i18n('contract.cancel.offerRepublished.title'),
        content: <OfferRepublished />,
        visible: true,
        level: 'APP',
        requireUserAction: true,
        action1: {
          label: i18n('goToOffer'),
          icon: 'arrowRightCircle',
          callback: goToOfferAction,
        },
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: closeAction,
        },
      })
    },
    [closePopup, confirmOverlay, navigation, setPopup, showErrorBanner],
  )

  return republishOffer
}
