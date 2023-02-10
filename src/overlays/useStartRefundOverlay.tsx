import { NETWORK } from '@env'
import React, { useCallback, useContext } from 'react'
import { Loading } from '../components'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import tw from '../styles/tailwind'
import { checkRefundPSBT, showTransaction, signPSBT } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { cancelOffer, postTx } from '../utils/peachAPI'
import { peachWallet } from '../utils/wallet/setWallet'

import Refund from './Refund'

export const useStartRefundOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const goToWallet = useCallback(
    (txId: string) => {
      closeOverlay()
      navigation.navigate('transactionDetails', { txId })
    },
    [closeOverlay, navigation],
  )
  const setOffer = useTradeSummaryStore((state) => state.setOffer)

  const refund = useCallback(
    async (sellOffer: SellOffer, rawPSBT: string) => {
      info('Get refunding info', rawPSBT)
      const { psbt, err } = checkRefundPSBT(rawPSBT, sellOffer)

      if (!psbt || err) {
        showError(err)
        closeOverlay()
        return
      }
      const signedTx = signPSBT(psbt, sellOffer).extractTransaction()
      const [tx, txId] = [signedTx.toHex(), signedTx.getId()]

      const address = psbt.txOutputs[0].address
      const isPeachWallet = address ? !!peachWallet.findKeyPairByAddress(address) : false
      saveOffer({
        ...sellOffer,
        tx,
        txId,
        refunded: true,
      })
      setOffer(sellOffer.id, { txId })
      updateOverlay({
        title: i18n('refund.title'),
        content: <Refund isPeachWallet={isPeachWallet} />,
        visible: true,
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            closeOverlay()
            navigation.navigate('yourTrades', { tab: 'sell' })
          },
        },
        action2: {
          label: i18n(isPeachWallet ? 'goToWallet' : 'showTx'),
          icon: isPeachWallet ? 'wallet' : 'externalLink',
          callback: () => (isPeachWallet ? goToWallet(txId) : showTransaction(txId, NETWORK)),
        },
        level: 'APP',
      })

      const [, postTXError] = await postTx({ tx, timeout: 15 * 1000 })
      if (postTXError) {
        showError(postTXError.error)
        closeOverlay()
      }
    },
    [closeOverlay, goToWallet, navigation, setOffer, showError, updateOverlay],
  )

  const startRefund = useCallback(
    async (sellOffer: SellOffer) => {
      updateOverlay({
        title: i18n('refund.loading.title'),
        content: <Loading style={tw`self-center`} color={tw`text-primary-main`.color} />,
        level: 'APP',
        visible: true,
        requireUserAction: true,
        action1: {
          label: i18n('loading'),
          icon: 'clock',
          callback: () => {},
        },
      })

      const [cancelResult, cancelError] = await cancelOffer({ offerId: sellOffer.id, timeout: 15 * 1000 })

      if (cancelResult) {
        await refund(sellOffer, cancelResult.psbt)
      } else {
        showError(cancelError?.error)
        closeOverlay()
      }
    },
    [closeOverlay, refund, showError, updateOverlay],
  )

  return startRefund
}
