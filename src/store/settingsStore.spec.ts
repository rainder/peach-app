import { useSettingsStore } from './settingsStore'
import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'

describe('settingsStore', () => {
  it('should keep analytics popup seen state when resetting', () => {
    useSettingsStore.getState().setAnalyticsPopupSeen(true)
    useSettingsStore.getState().reset()
    expect(useSettingsStore.getState().analyticsPopupSeen).toBeTruthy()
  })
  it('should enable analytics', () => {
    useSettingsStore.getState().setEnableAnalytics(true)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(true)
  })
  it('should disable analytics', () => {
    useSettingsStore.getState().setEnableAnalytics(false)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(false)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(false)
  })
  it('should keep locale state when resetting', () => {
    useSettingsStore.getState().setLocale('es')
    useSettingsStore.getState().reset()
    expect(useSettingsStore.getState().locale).toBe('es')
  })
})
