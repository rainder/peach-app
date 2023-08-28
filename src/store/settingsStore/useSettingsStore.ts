import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Locale } from '../../utils/i18n'
import { error } from '../../utils/log'
import { dateTimeReviver } from '../../utils/system'
import { defaultSettings } from './defaultSettings'
import { getPureSettingsState } from './helpers/getPureSettingsState'
import { migrateSettings } from './helpers/migration'
import { settingsStorage } from './settingsStorage'

export type SettingsStore = Settings & {
  migrated?: boolean
  reset: () => void
  updateSettings: (settings: Settings) => void
  getPureState: () => Settings
  setMigrated: () => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setLastSeedBackupDate: (lastSeedBackupDate: number) => void
  updateSeedBackupDate: () => void
  setLastFileBackupDate: (lastFileBackupDate: number) => void
  updateFileBackupDate: () => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  togglePeachWallet: () => void
  setFeeRate: (feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee') => void
  setUsedReferralCode: (usedReferralCode: boolean) => void
  setPGPPublished: (pgpPublished: boolean) => void
  setFCMToken: (fcmToken: string) => void
}

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      reset: () =>
        set((state) => ({
          ...defaultSettings,
          migrated: false,
          analyticsPopupSeen: state.analyticsPopupSeen,
          locale: state.locale,
        })),
      setMigrated: () => set({ migrated: true }),
      getPureState: () => getPureSettingsState(get()),
      updateSettings: (settings) => set({ ...settings }),
      setEnableAnalytics: (enableAnalytics) => {
        analytics().setAnalyticsCollectionEnabled(enableAnalytics)
        perf().setPerformanceCollectionEnabled(enableAnalytics)

        set({ enableAnalytics })
      },
      toggleAnalytics: () => get().setEnableAnalytics(!get().enableAnalytics),
      setAnalyticsPopupSeen: (analyticsPopupSeen) => set({ analyticsPopupSeen }),
      setPayoutAddress: (payoutAddress) => set({ payoutAddress }),
      setPayoutAddressLabel: (payoutAddressLabel) => set({ payoutAddressLabel }),
      setPayoutAddressSignature: (payoutAddressSignature) => set({ payoutAddressSignature }),
      setLocale: (locale) => set({ locale }),
      setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
      setLastFileBackupDate: (lastFileBackupDate) => set({ lastFileBackupDate }),
      updateFileBackupDate: () =>
        set({ lastFileBackupDate: Date.now(), shouldShowBackupOverlay: false, showBackupReminder: false }),
      setLastSeedBackupDate: (lastSeedBackupDate) => set({ lastSeedBackupDate }),
      updateSeedBackupDate: () =>
        set({ lastSeedBackupDate: Date.now(), shouldShowBackupOverlay: false, showBackupReminder: false }),
      setShowBackupReminder: (showBackupReminder) =>
        set({ showBackupReminder, shouldShowBackupOverlay: showBackupReminder }),
      setPeachWalletActive: (peachWalletActive) => set({ peachWalletActive }),
      togglePeachWallet: () => get().setPeachWalletActive(!get().peachWalletActive),
      setFeeRate: (feeRate) => set({ feeRate }),
      setUsedReferralCode: (usedReferralCode) => set({ usedReferralCode }),
      setPGPPublished: (pgpPublished) => set({ pgpPublished }),
      setFCMToken: (fcmToken) => set({ fcmToken }),
    }),
    {
      name: 'settings',
      version: 3,
      migrate: migrateSettings,
      storage: createJSONStorage(() => ({
        setItem: async (name: string, value: unknown) => {
          await settingsStorage.setItem(name, JSON.stringify(value))
        },
        getItem: async (name: string) => {
          const value = await settingsStorage.getItem(name)
          try {
            if (typeof value === 'string') return JSON.parse(value, dateTimeReviver)
          } catch (e) {
            error(e)
          }
          return null
        },
        removeItem: (name: string) => {
          settingsStorage.removeItem(name)
        },
      })),
    },
  ),
)
