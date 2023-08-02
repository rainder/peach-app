import { useCallback, useEffect, useState } from 'react'
import { useCancelOffer, useRoute } from '../../../hooks'
import { useFundingStatus } from '../../../hooks/query/useFundingStatus'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { isSellOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { shouldGetFundingStatus } from '../../sell/helpers/shouldGetFundingStatus'
import { useCreateEscrow } from './useCreateEscrow'
import { useFundEscrowHeader } from './useFundEscrowHeader'
import { useHandleFundingStatus } from './useHandleFundingStatus'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getFundingAmount } from '../helpers/getFundingAmount'

const minLoadingTime = 1000
export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const { offerId } = route.params

  const showErrorBanner = useShowErrorBanner()

  const { offer } = useOfferDetails(route.params.offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const [showLoading, setShowLoading] = useState(!sellOffer?.escrow ? Date.now() : 0)
  const canFetchFundingStatus = !sellOffer || shouldGetFundingStatus(sellOffer)
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
  } = useFundingStatus(offerId, canFetchFundingStatus)
  const fundMultiple = useWalletState((state) => state.getFundMultipleByOfferId(offerId))
  const fundingAmount = getFundingAmount(sellOffer, fundMultiple)
  const cancelOffer = useCancelOffer(sellOffer)

  useFundEscrowHeader({ fundingStatus, sellOffer })

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  })

  const onSuccess = useCallback(() => {
    const timeout = Math.max(0, minLoadingTime - (Date.now() - showLoading))
    setTimeout(() => setShowLoading(0), timeout)
  }, [showLoading])

  const { mutate: createEscrow, error: createEscrowError } = useCreateEscrow({
    offerId,
  })

  useEffect(() => {
    if (!sellOffer || sellOffer.escrow) return
    createEscrow(undefined, {
      onSuccess,
    })
  }, [sellOffer, createEscrow, onSuccess])

  useEffect(() => {
    if (!fundingStatusError) return
    showErrorBanner(parseError(fundingStatusError))
  }, [fundingStatusError, showErrorBanner])

  return {
    offerId,
    offer: sellOffer,
    isLoading: showLoading > 0,
    escrow: sellOffer?.escrow,
    createEscrowError,
    fundingStatus,
    fundingAmount,
    cancelOffer,
  }
}
