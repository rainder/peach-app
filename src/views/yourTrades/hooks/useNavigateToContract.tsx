import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../overlays/useStartRefundPopup'
import { getOffer } from '../../../utils/offer'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToContract = (contractSummary: ContractSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundPopup()
  const showContractPopup = useNavigateToContractPopups(contractSummary.id)

  const navigateToContract = async () => {
    const [screen, params] = await getNavigationDestinationForContract(contractSummary)

    if (shouldOpenOverlay(contractSummary.tradeStatus)) {
      const sellOffer = getOffer(contractSummary.offerId) as SellOffer
      if (sellOffer) startRefund(sellOffer)
    }

    navigation.navigate(screen, params)
    showContractPopup()
  }

  return navigateToContract
}
