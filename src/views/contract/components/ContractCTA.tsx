import { PrimaryButton } from '../../../components'
import { WarningButton } from '../../../components/buttons'
import { SlideToUnlock } from '../../../components/inputs'
import { useConfirmTradeCancelationOverlay } from '../../../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { usePaymentTooLatePopup } from '../../../overlays/usePaymentTooLatePopup'
import tw from '../../../styles/tailwind'
import { getPaymentExpectedBy } from '../../../utils/contract/getPaymentExpectedBy'
import i18n from '../../../utils/i18n'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/overlay'
import { useContractContext } from '../context'

type Props = {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractCTA = ({
  requiredAction,
  actionPending,
  postConfirmPaymentBuyer,
  postConfirmPaymentSeller,
}: Props) => {
  const showPaymentTooLatePopup = usePaymentTooLatePopup()
  const { showConfirmTradeCancelation } = useConfirmTradeCancelationOverlay()
  const { contract, view } = useContractContext()

  if (shouldShowConfirmCancelTradeRequest(contract, view)) return (
    <WarningButton onPress={() => showConfirmTradeCancelation(contract)}>{i18n('contract.respond')}</WarningButton>
  )
  if (view === 'buyer' && requiredAction === 'confirmPayment') return (
    <PrimaryButton disabled iconId="send">
      {i18n('contract.payment.sent')}
    </PrimaryButton>
  )

  if (view === 'seller' && requiredAction === 'sendPayment') return (
    <PrimaryButton disabled iconId="watch">
      {i18n('contract.payment.notYetSent')}
    </PrimaryButton>
  )
  if (view === 'buyer' && requiredAction === 'sendPayment') {
    const paymentExpectedBy = getPaymentExpectedBy(contract)
    if (Date.now() < paymentExpectedBy) {
      return (
        <SlideToUnlock
          style={tw`w-[263px]`}
          disabled={actionPending}
          onUnlock={postConfirmPaymentBuyer}
          label1={i18n('contract.payment.buyer.confirm')}
          label2={i18n('contract.payment.made')}
        />
      )
    }
    return (
      <WarningButton onPress={showPaymentTooLatePopup} iconId="alertOctagon" disabled={contract.disputeActive}>
        {i18n('contract.timer.paymentTimeExpired.button.buyer')}
      </WarningButton>
    )
  }
  if (view === 'seller' && requiredAction === 'confirmPayment') return (
    <SlideToUnlock
      style={tw`w-[263px]`}
      disabled={actionPending}
      onUnlock={postConfirmPaymentSeller}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.received')}
    />
  )

  return <></>
}
