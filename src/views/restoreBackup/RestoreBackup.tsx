import React, { ReactElement, useState } from 'react'

import { View } from 'react-native'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import RestoreFromFile from './RestoreFromFile'
import RestoreFromSeed from './RestoreFromSeed'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'fileBackup',
    display: i18n('settings.backups.fileBackup'),
    view: RestoreFromFile,
  },
  {
    id: 'seedPhrase',
    display: i18n('settings.backups.seedPhrase'),
    view: RestoreFromSeed,
  },
]

export default (): ReactElement => {
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const CurrentView = currentTab.view

  return (
    <View style={tw`h-full`}>
      <View style={tw`h-full flex flex-col px-6 pt-12`}>
        <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
        <CurrentView style={tw`h-full mt-12 flex-shrink`} />
      </View>
    </View>
  )
}
