import React from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/CancelTradeRequestRejected'
import { BuyerCanceledTrade } from '../../../overlays/tradeCancelation/BuyerCanceledTrade'
import { ConfirmCancelTradeRequest } from '../../../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from '../../../overlays/YouGotADispute'
import { account } from '../../../utils/account'
import { StackNavigation } from '../../../utils/navigation'
import { getChat, saveChat } from '../../../utils/chat'
import { endDisputeSystemMessages } from '../../../utils/chat/createDisputeSystemMessages'

type HandleOverlaysProps = {
  contract: Contract
  navigation: StackNavigation
  updateOverlay: React.Dispatch<OverlayState>
  view: 'buyer' | 'seller' | ''
}

/**
 * @description Helperfunction to open respective overlays if applicable
 * @param contract contract
 * @param navigation navigation
 * @param updateOverlay function to open overlay
 */
// eslint-disable-next-line complexity
export const handleOverlays = ({ contract, navigation, updateOverlay, view }: HandleOverlaysProps) => {
  if (
    contract.disputeActive
    && contract.disputeInitiator !== account.publicKey
    && !contract.disputeAcknowledgedByCounterParty
  ) {
    return updateOverlay({
      content: (
        <YouGotADispute
          contractId={contract.id}
          message={contract.disputeClaim!}
          reason={contract.disputeReason!}
          navigation={navigation}
        />
      ),
      showCloseButton: false,
    })
  }

  if (!contract.disputeActive && contract.disputeResolvedDate && !contract.disputeResultAcknowledged) {
    const chat = getChat(contract.id)
    const autogeneratedMessages = endDisputeSystemMessages(chat.id, contract)
    saveChat(contract.id, {
      messages: autogeneratedMessages,
    })
    return updateOverlay({
      content: <DisputeResult contractId={contract.id} navigation={navigation} />,
    })
  }

  if (contract.cancelationRequested && view === 'buyer') {
    return updateOverlay({
      content: <ConfirmCancelTradeRequest contract={contract} navigation={navigation} />,
    })
  }

  if (
    contract.canceled
    && view === 'seller'
    && !contract.cancelationRequested
    && contract.cancelConfirmationPending
    && !contract.cancelConfirmationDismissed
  ) {
    return updateOverlay({
      content: <CancelTradeRequestConfirmed contract={contract} navigation={navigation} />,
    })
  }

  if (
    !contract.canceled
    && view === 'seller'
    && !contract.cancelationRequested
    && contract.cancelConfirmationPending
    && !contract.cancelConfirmationDismissed
  ) {
    return updateOverlay({
      content: <CancelTradeRequestRejected contract={contract} navigation={navigation} />,
    })
  }

  if (contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed) {
    return updateOverlay({
      content: <BuyerCanceledTrade contract={contract} navigation={navigation} />,
    })
  }

  return null
}
