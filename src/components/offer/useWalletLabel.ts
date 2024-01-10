import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import i18n from '../../utils/i18n'
import { getWalletLabel } from '../../utils/offer/getWalletLabel'

type Props = {
  label?: string
  address?: string
  isPayoutWallet?: boolean
}

export const useWalletLabel = ({ label, address, isPayoutWallet = false }: Props) => {
  const [customAddress, customAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [
      isPayoutWallet ? state.payoutAddress : state.refundAddress,
      isPayoutWallet ? state.payoutAddressLabel : state.refundAddressLabel,
      isPayoutWallet ? state.payoutToPeachWallet : state.refundToPeachWallet,
    ],
    shallow,
  )
  const [fallbackLabel, setFallbackLabel] = useState(i18n('loading'))

  useEffect(() => {
    if (label) return

    // this operation can be expensive, hence we delay execution
    setTimeout(() => {
      setFallbackLabel(
        getWalletLabel({
          address,
          customAddress,
          customAddressLabel,
          isPeachWalletActive,
        }),
      )
    })
  }, [address, label, customAddress, customAddressLabel, isPeachWalletActive])

  return label || fallbackLabel
}
