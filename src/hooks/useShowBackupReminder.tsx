import { useSettingsStore } from '../store/settingsStore'
import { useShowWarning } from './useShowWarning'

export const useShowBackupReminder = () => {
  const showFirstBackupWarning = useShowWarning('firstBackup')
  const showPaymentBackupWarning = useShowWarning('paymentBackup')
  const lastBackupDate = useSettingsStore((state) => state.lastBackupDate)

  return !!lastBackupDate ? showPaymentBackupWarning : showFirstBackupWarning
}
