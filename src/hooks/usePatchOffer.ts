import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MatchFilter } from '../../peach-api/src/@types/api/offerAPI'
import { peachAPI } from '../utils/peachAPI'
import { useShowErrorBanner } from './useShowErrorBanner'

export type PatchOfferData = {
  refundAddress?: string
  refundTx?: string
  premium?: number
} & Partial<MatchFilter>

export const usePatchOffer = () => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async ({ offerId, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      const previousData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      queryClient.setQueryData<BuyOffer | SellOffer>(
        ['offer', offerId],
        (oldQueryData) => oldQueryData && { ...oldQueryData, ...newData },
      )

      return { previousData }
    },
    mutationFn: async ({ offerId, newData }: { offerId: string; newData: PatchOfferData }) => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, { offerId }, context) => {
      queryClient.setQueryData(['offer', offerId || offerId], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: (_data, _error, { offerId }) => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] })
    },
  })
}

export type PatchBuyOfferData = {
  amount?: [number, number]
} & Partial<MatchFilter>

export const usePatchBuyOffer = () => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async ({ offerId, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      const previousData = queryClient.getQueryData<BuyOffer>(['offer', offerId])
      queryClient.setQueryData<BuyOffer>(
        ['offer', offerId],
        (oldQueryData) => oldQueryData && { ...oldQueryData, ...newData },
      )

      return { previousData }
    },
    mutationFn: async ({ offerId, newData }: { offerId: string; newData: PatchBuyOfferData }) => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, { offerId }, context) => {
      queryClient.setQueryData(['offer', offerId || offerId], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: (_data, _error, { offerId }) => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] })
    },
  })
}
