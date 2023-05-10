import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getContractSummaries } from '../../utils/peachAPI'

const getContractSummariesQuery = async () => {
  const [contracts, error] = await getContractSummaries({})

  if (error) throw new Error(error.error)
  return contracts || undefined
}

export const useContractSummaries = (enabled = true) => {
  const [contracts, setContracts, lastModified] = useTradeSummaryStore(
    (state) => [state.contracts, state.setContracts, state.lastModified],
    shallow,
  )
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['contractSummaries'],
    queryFn: getContractSummariesQuery,
    enabled,
    refetchOnMount: true,
    initialData: contracts,
    initialDataUpdatedAt: lastModified.getTime(),
    onSuccess: (result) => {
      if (!result) return
      setContracts(result)
    },
  })

  return { contracts: data, isLoading, isFetching, error, refetch }
}
