import { useCallback, useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useOfferDetailsQuery } from '../../../hooks/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBuyOffer, saveOffer } from '../../../utils/offer'
import { signMessageToPublish } from '../../../utils/peachAPI'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { peachWallet } from '../../../utils/wallet/setWallet'

const signatureRules = {
  required: true,
}
export const useSignMessageSetup = () => {
  const route = useRoute<'signMessage'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const { offer } = useOfferDetailsQuery(route.params.offerId)
  const [, updateMessage] = useContext(MessageContext)
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)
  const signatureField = useValidatedState('', signatureRules)

  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const submit = useCallback(
    async (sig: string) => {
      if (!offer) return

      const [signMessageToPublishResult, signMessageToPublishError] = await signMessageToPublish({
        offerId: route.params.offerId,
        signature: sig,
      })
      if (signMessageToPublishResult) {
        const patchedOffer: BuyOffer = {
          ...offer,
          online: true,
          messageSignature: sig,
        }
        saveOffer(patchedOffer)
        if (patchedOffer.online) {
          matchStoreSetOffer(patchedOffer)
          navigation.navigate('search')
        }
      } else if (signMessageToPublishError) {
        showErrorBanner(signMessageToPublishError.error)
      }
    },
    [matchStoreSetOffer, navigation, offer, route.params.offerId, showErrorBanner],
  )

  useEffect(() => {
    if (!offer || !isBuyOffer(offer) || !offer.message || !peachWalletActive) return
    const peachAccount = getPeachAccount()

    if (!peachAccount) {
      showErrorBanner(new Error('Peach Account not set'))
      return
    }
    const sig = peachWallet.signMessage(offer.message, offer.releaseAddress)
    submit(sig)
  }, [peachWalletActive, updateMessage, navigation, submit, showErrorBanner, offer])

  return {
    message: offer?.message,
    peachWalletActive,
    submit,
    signatureField,
  }
}
