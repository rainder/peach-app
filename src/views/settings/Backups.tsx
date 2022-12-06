import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'

import { Card, GoBackButton, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { BackupCreated } from '../../overlays/BackupCreated'
import SaveAccount from '../../overlays/info/SaveAccount'
import { account, backupAccount, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { toShortDateFormat } from '../../utils/string'

export default (): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [isBackingUp, setIsBackingUp] = useState(false)

  const initAccountBackup = () => {
    if (isBackingUp) return
    const previousDate = account.settings.lastBackupDate
    const previousShowBackupReminder = account.settings.showBackupReminder
    setIsBackingUp(true)
    updateSettings(
      {
        lastBackupDate: new Date().getTime(),
        showBackupReminder: false,
      },
      true,
    )
    backupAccount({
      onSuccess: () => {
        updateOverlay({
          content: <BackupCreated />,
          showCloseButton: false,
        })
        updateSettings(
          {
            lastBackupDate: new Date().getTime(),
            showBackupReminder: false,
          },
          true,
        )
        setIsBackingUp(false)

        setTimeout(() => {
          updateOverlay({
            content: null,
            showCloseButton: true,
          })
        }, 3000)
      },
      onCancel: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
      onError: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
    })
  }

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} help={<SaveAccount />} />
      <View style={tw`h-full flex-shrink mt-12`}>
        {account.settings.lastBackupDate ? (
          <Text style={tw`text-center text-grey-1`}>
            {i18n('settings.backups.lastBackup')} {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
          </Text>
        ) : null}
        <Pressable style={tw`mt-2`} onPress={initAccountBackup}>
          <Card>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups.createNew')}</Text>
          </Card>
        </Pressable>
      </View>
      <GoBackButton style={tw`self-center mt-16`} />
    </View>
  )
}
