import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useFileBackupOverviewSetup = () => {
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)

  const showPopup = useShowHelp('fileBackup')
  useHeaderSetup({
    title: i18n('settings.backups.fileBackup.title'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showPopup }],
  })

  return {
    lastFileBackupDate,
  }
}
