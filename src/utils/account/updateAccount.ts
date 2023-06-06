import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { getDeviceLocale } from '../system'
import { account, defaultAccount, setAccount } from './account'
import { loadAccountFromSeedPhrase } from './loadAccountFromSeedPhrase'

export const updateAccount = async (acc: Account, overwrite?: boolean) => {
  setAccount(
    overwrite
      ? acc
      : {
        ...defaultAccount,
        ...acc,
        tradingLimit: defaultAccount.tradingLimit,
      },
  )

  setLocaleQuiet(settingsStore.getState().locale || getDeviceLocale() || 'en')

  if (account.mnemonic) loadAccountFromSeedPhrase(account.mnemonic)
}
