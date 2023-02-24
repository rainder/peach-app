import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import i18n from '../../../utils/i18n'
import { getOffer, isSellOffer, saveOffer } from '../../../utils/offer'
import { patchOffer } from '../../../utils/peachAPI'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletSetup } from './useWalletSetup'

export const useSetRefundWalletSetup = () => {
  const route = useRoute<'setRefundWallet'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const { wallets, setSelectedWallet, payoutAddress, payoutAddressLabel, peachWalletActive, setPeachWalletActive }
    = useWalletSetup()

  const { offerId } = route.params

  useHeaderSetup({
    title: i18n('setRefundWallet.title'),
  })

  const goToSetRefundWallet = () => {
    setPeachWalletActive(false)
    navigation.navigate('payoutAddress', { type: 'refund' })
  }

  const selectAndContinue = async () => {
    let refundAddress: string | undefined = payoutAddress
    if (!refundAddress && peachWalletActive) refundAddress = await peachWallet.getReceivingAddress()
    if (!refundAddress) return

    const [result, error] = await patchOffer({
      offerId,
      refundAddress,
    })
    if (error) showErrorBanner(error.error)
    if (result) {
      const sellOffer = getOffer(offerId)
      if (sellOffer && isSellOffer(sellOffer)) saveOffer({
        ...sellOffer,
        walletLabel: payoutAddressLabel,
        returnAddress: refundAddress,
      })
    }
    navigation.goBack()
  }

  return {
    wallets,
    peachWalletActive,
    setSelectedWallet,
    payoutAddress,
    payoutAddressLabel,
    goToSetRefundWallet,
    selectAndContinue,
  }
}
