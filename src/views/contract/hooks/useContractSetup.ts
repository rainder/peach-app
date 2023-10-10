import { useIsFocused } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { z } from 'zod'
import { FIFTEEN_SECONDS } from '../../../constants'
import { useNavigation, useRoute } from '../../../hooks'
import { useHandleNotifications } from '../../../hooks/notifications/useHandleNotifications'
import { useContractDetails } from '../../../hooks/query/useContractDetails'
import { account } from '../../../utils/account'
import { getContractViewer, shouldRateCounterParty } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { useWebsocketContext } from '../../../utils/peachAPI/websocket'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

export const useContractSetup = () => {
  const { contractId } = useRoute<'contract'>().params
  const isFocused = useIsFocused()
  const { contract, isLoading, refetch } = useContractDetails(contractId, FIFTEEN_SECONDS)
  const view = contract ? getContractViewer(contract, account) : undefined
  const navigation = useNavigation()
  const shouldShowFeeWarning = view === 'buyer' && !!contract?.paymentMade && !contract?.paymentConfirmed

  useHandleNotifications(
    useCallback(
      (message) => {
        if (message.data?.contractId === contractId) refetch()
      },
      [contractId, refetch],
    ),
  )

  useShowHighFeeWarning({ enabled: shouldShowFeeWarning, amount: contract?.amount })
  useShowLowFeeWarning({ enabled: shouldShowFeeWarning })

  useEffect(() => {
    if (!contract || !view || isLoading || !isFocused) return
    if (isTradeComplete(contract) && !contract.disputeWinner && !contract.canceled) {
      if (shouldRateCounterParty(contract, view)) {
        refetch().then(({ data }) => {
          if (data && shouldRateCounterParty(data, view)) navigation.replace('tradeComplete', { contract: data })
        })
      }
    }
  }, [contract, isFocused, isLoading, navigation, refetch, view])

  useChatMessageHandler()
  useContractUpdateHandler()

  return {
    contract,
    isLoading,
    view,
  }
}

const messageSchema = z.object({
  message: z.string(),
  roomId: z.string(),
  from: z.string(),
})
function useChatMessageHandler () {
  const { contractId } = useRoute<'contract'>().params
  const { contract } = useContractDetails(contractId, FIFTEEN_SECONDS)
  const queryClient = useQueryClient()
  const ws = useWebsocketContext()

  useEffect(() => {
    const messageHandler = (message: unknown) => {
      if (!contract) return
      const messageParsed = messageSchema.safeParse(message)
      if (!messageParsed.success) return
      const { message: remoteMessage, roomId, from } = messageParsed.data
      if (!remoteMessage || roomId !== `contract-${contractId}` || from === account.publicKey) return

      queryClient.setQueryData(['contract', contractId], (oldContract: Contract | undefined) =>
        !oldContract
          ? oldContract
          : {
            ...oldContract,
            unreadMessages: oldContract.unreadMessages + 1,
          },
      )
      queryClient.refetchQueries(['contract', contractId])
    }

    const unsubscribe = () => {
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', messageHandler)

    return unsubscribe
  }, [contract, contractId, queryClient, ws])
}

const contractUpdateSchema = z.object({
  contractId: z.string(),
  event: z.union([z.literal('paymentMade'), z.literal('paymentConfirmed')]),
  data: z.object({
    date: z.number(),
  }),
})
function useContractUpdateHandler () {
  const { contractId } = useRoute<'contract'>().params
  const { contract } = useContractDetails(contractId, FIFTEEN_SECONDS)
  const queryClient = useQueryClient()
  const ws = useWebsocketContext()
  useEffect(() => {
    const contractUpdateHandler = (update: unknown) => {
      const contractUpdate = contractUpdateSchema.safeParse(update)
      if (!contractUpdate.success) return
      const { event, data } = contractUpdate.data

      if (!contract || contractUpdate.data.contractId !== contractId || !event) return
      queryClient.setQueryData(['contract', contractId], (oldContract: Contract | undefined) =>
        !oldContract
          ? oldContract
          : {
            ...oldContract,
            [event]: new Date(data.date),
          },
      )
      queryClient.invalidateQueries(['contract', contractId])
    }

    const unsubscribe = () => {
      ws.off('message', contractUpdateHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', contractUpdateHandler)

    return unsubscribe
  }, [contract, contractId, queryClient, ws])
}
