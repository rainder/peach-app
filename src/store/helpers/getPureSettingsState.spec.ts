import { defaultSettings } from '../defaults'
import { useSettingsStore } from '../settingsStore'
import { getPureSettingsState } from './getPureSettingsState'

describe('getPureSettingsState', () => {
  it('returns pure settings state', () => {
    expect(getPureSettingsState(useSettingsStore.getState())).toEqual(defaultSettings)
  })
})
