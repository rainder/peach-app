import { useIsFocused } from '@react-navigation/native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { decryptSymmetric } from '../../utils/pgp/decryptSymmetric'

export const PAGE_SIZE = 22

type GetChatQueryProps = {
  queryKey: [string, string]
  pageParam?: number
}
const getChatQuery = async ({ queryKey, pageParam = 0 }: GetChatQueryProps) => {
  const [, contractId] = queryKey
  const { result, error } = await peachAPI.private.contract.getChat({
    contractId,
    page: pageParam,
  })
  let messages
  if (result) {
    messages = result.map((message) => ({
      ...message,
      date: new Date(message.date),
    }))
  }

  if (!messages || error) throw new Error(error?.error)

  return messages
}

const getDecryptedChat
  = (symmetricKey: string) =>
    async ({ queryKey, pageParam = 0 }: GetChatQueryProps) => {
      const messages = await getChatQuery({ queryKey, pageParam })

      return Promise.all(
        messages.map(async (message) => {
          try {
            const decrypted = await decryptSymmetric(message.message, symmetricKey)
            if (message.from === 'system') {
              const [textId, ...args] = decrypted.split('::')
              return {
                ...message,
                message: i18n(textId, ...args),
                decrypted: !!decrypted,
              }
            }
            return {
              ...message,
              message: decrypted,
              decrypted: !!decrypted,
            }
          } catch (e) {
            return {
              ...message,
              decrypted: false,
            }
          }
        }),
      )
    }

export const useChatMessages = ({ id, symmetricKey }: { id: string; symmetricKey?: string }) => {
  const isFocused = useIsFocused()
  const { data, isLoading, isFetching, error, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['contract-chat', id],
    queryFn: symmetricKey ? getDecryptedChat(symmetricKey) : () => [],
    keepPreviousData: true,
    enabled: !!symmetricKey && isFocused,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length : null),
  })

  const messages = useMemo(() => (data?.pages || []).flat(), [data?.pages])

  return {
    messages,
    isLoading,
    isFetching,
    error,
    page: (data?.pages.length || 1) - 1,
    fetchNextPage,
    hasNextPage,
    refetch,
  }
}
