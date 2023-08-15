import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction } from '../../../utils/wallet/transaction'

type Props = {
  address: string
  amount: number
  feeRate: number
  shouldDrainWallet?: boolean
  onSuccess: () => void
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const openWithdrawalConfirmationPopup = useCallback(
    async ({ address, amount, feeRate, shouldDrainWallet, onSuccess }: Props) => {
      const { psbt } = shouldDrainWallet
        ? await peachWallet.finishTransaction(await buildDrainWalletTransaction(address, feeRate))
        : await peachWallet.buildAndFinishTransaction(address, amount, feeRate)
      const confirm = async () => {
        await peachWallet.signAndBroadcastPSBT(psbt)
        onSuccess()
      }
      const fee = await psbt.feeAmount()

      setPopup({
        title: i18n('wallet.confirmWithdraw.title'),
        content: <WithdrawalConfirmation {...{ amount, address, fee, feeRate }} />,
        action2: {
          callback: closePopup,
          label: i18n('cancel'),
          icon: 'xCircle',
        },
        action1: {
          callback: confirm,
          label: i18n('wallet.confirmWithdraw.confirm'),
          icon: 'arrowRightCircle',
        },
        level: 'APP',
      })
    },
    [closePopup, setPopup],
  )
  return openWithdrawalConfirmationPopup
}
