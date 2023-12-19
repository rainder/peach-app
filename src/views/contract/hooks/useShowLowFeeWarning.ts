import { useEffect } from 'react'
import { useMessageState } from '../../../components/message/useMessageState'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useNavigation } from '../../../hooks/useNavigation'
import i18n from '../../../utils/i18n'

type Props = {
  enabled: boolean
}
export const useShowLowFeeWarning = ({ enabled }: Props) => {
  const navigation = useNavigation()
  const updateMessage = useMessageState((state) => state.updateMessage)
  const feeRate = useFeeRate()
  const { estimatedFees } = useFeeEstimate()

  useEffect(() => {
    if (!enabled) return
    if (feeRate >= estimatedFees.minimumFee) return

    updateMessage({
      msgKey: 'contract.warning.lowFee',
      bodyArgs: [String(estimatedFees.minimumFee)],
      level: 'WARN',
      action: {
        callback: () => {
          navigation.navigate('networkFees')
          updateMessage({ msgKey: undefined, level: 'WARN' })
        },
        label: i18n('contract.warning.lowFee.changeFee'),
        icon: 'settings',
      },
    })
  }, [updateMessage, feeRate, navigation, enabled, estimatedFees.minimumFee])
}
