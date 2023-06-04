import { act, renderHook } from '@testing-library/react-native'
import { useSettingsSetup } from './useSettingsSetup'
import { settingsStore } from '../../../store/settingsStore'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

describe('useSettingsSetup', () => {
  afterEach(() => {
    act(() => {
      settingsStore.getState().reset()
    })
  })
  it('returns default settings items', () => {
    const { result } = renderHook(useSettingsSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual([
      {
        items: [{ title: 'testView' }, { title: 'contact' }, { title: 'aboutPeach' }],
      },
      {
        headline: 'profileSettings',
        items: [
          { title: 'myProfile' },
          { title: 'referrals' },
          { title: 'backups', warning: false },
          { title: 'networkFees' },
          { title: 'paymentMethods' },
        ],
      },
      {
        headline: 'appSettings',
        items: [
          { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'analytics' },
          { onPress: expect.any(Function), title: 'notifications' },
          { title: 'payoutAddress' },
          { title: 'currency' },
          { title: 'language' },
        ],
      },
    ])
  })
  it('returns shows analytics as active if it is', () => {
    settingsStore.getState().setEnableAnalytics(true)
    const { result } = renderHook(useSettingsSetup, { wrapper: NavigationWrapper })
    expect(result.current[2].items).toEqual([
      { enabled: true, iconId: 'toggleRight', onPress: expect.any(Function), title: 'analytics' },
      { onPress: expect.any(Function), title: 'notifications' },
      { title: 'payoutAddress' },
      { title: 'currency' },
      { title: 'language' },
    ])
  })
  it('does not highlight backups if backup reminder is not active', () => {
    settingsStore.getState().setShowBackupReminder(false)
    const { result } = renderHook(useSettingsSetup, { wrapper: NavigationWrapper })
    expect(result.current[1].items).toEqual([
      { title: 'myProfile' },
      { title: 'referrals' },
      { title: 'backups', warning: false },
      { title: 'networkFees' },
      { title: 'paymentMethods' },
    ])
  })
  it('does  highlight backups if backup reminder is  active', () => {
    settingsStore.getState().setShowBackupReminder(true)
    const { result } = renderHook(useSettingsSetup, { wrapper: NavigationWrapper })
    expect(result.current[1].items).toEqual([
      { title: 'myProfile' },
      { title: 'referrals' },
      { title: 'backups', warning: true, iconId: 'alertTriangle' },
      { title: 'networkFees' },
      { title: 'paymentMethods' },
    ])
  })
})
