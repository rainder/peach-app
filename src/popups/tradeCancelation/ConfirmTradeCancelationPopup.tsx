import { shallow } from 'zustand/shallow'
import { useClosePopup, useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import { LoadingPopupAction } from '../../components/popup/actions/LoadingPopupAction'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getSellOfferFromContract } from '../../utils/contract/getSellOfferFromContract'
import { getWalletLabelFromContract } from '../../utils/contract/getWalletLabelFromContract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer/getOfferExpiry'
import { saveOffer } from '../../utils/offer/saveOffer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { peachAPI } from '../../utils/peachAPI'
import { useContractMutation } from '../../views/contract/hooks/useContractMutation'
import { GrayPopup } from '../GrayPopup'
import { cancelContractAsSeller } from './cancelContractAsSeller'

export function ConfirmTradeCancelationPopup ({ contract }: { contract: Contract }) {
  const setPopup = useSetPopup()
  const closePopup = useClosePopup()
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const { mutate: cancelSeller } = useContractMutation(
    {},
    {
      mutationFn: async () => {
        setPopup(<CancelPopup contract={contract} />)

        const { result, error } = await cancelContractAsSeller(contract)

        if (error) throw new Error(error)
        return result
      },
      onSuccess: (result) => {
        const { sellOffer } = result
        if (sellOffer) saveOffer(sellOffer)
      },
    },
  )
  const { mutate: cancelBuyer } = useContractMutation(
    { canceled: true, tradeStatus: 'tradeCanceled' },
    {
      mutationFn: async () => {
        setPopup(
          <GrayPopup
            title={i18n('contract.cancel.success')}
            actions={<ClosePopupAction style={tw`justify-center`} />}
          />,
        )
        const { error } = await peachAPI.private.contract.cancelContract({ contractId: contract.id })
        if (error?.error) throw new Error(error.error)
      },
    },
  )
  const view = publicKey === contract?.seller.id ? 'seller' : 'buyer'
  const cancelAction = () => (view === 'seller' ? cancelSeller() : cancelBuyer())
  const title = i18n(isCashTrade(contract.paymentMethod) ? 'contract.cancel.cash.title' : 'contract.cancel.title')
  const isCash = isCashTrade(contract.paymentMethod)

  return (
    <PopupComponent
      title={title}
      content={i18n(isCash ? 'contract.cancel.cash.text' : `contract.cancel.${view}`)}
      actions={
        <>
          <PopupAction label={i18n('contract.cancel.confirm.back')} iconId="arrowLeftCircle" onPress={closePopup} />
          <LoadingPopupAction
            label={i18n('contract.cancel.title')}
            iconId="xCircle"
            onPress={cancelAction}
            reverseOrder
          />
        </>
      }
      actionBgColor={tw`bg-black-50`}
      bgColor={tw`bg-primary-background-light`}
    />
  )
}

function CancelPopup ({ contract }: { contract: Contract }) {
  const [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.peachWalletActive],
    shallow,
  )
  const { paymentMethod, id } = contract
  const isCash = isCashTrade(paymentMethod)
  const canRepublish = !getOfferExpiry(getSellOfferFromContract(contract)).isExpired
  const walletName = getWalletLabelFromContract({
    contract,
    customPayoutAddress,
    customPayoutAddressLabel,
    isPeachWalletActive,
  })
  return (
    <GrayPopup
      title={i18n(isCashTrade(paymentMethod) ? 'contract.cancel.tradeCanceled' : 'contract.cancel.requestSent')}
      content={
        isCash
          ? canRepublish
            ? i18n('contract.cancel.cash.refundOrRepublish.text')
            : i18n('contract.cancel.cash.tradeCanceled.text', id, walletName)
          : i18n('contract.cancel.requestSent.text')
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  )
}
