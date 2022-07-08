import { account, saveAccount } from '.'
import { session } from '../session'

/**
 * @description Method to update app settings
 * @param options settings to update
 * @param save if true save account on device
 */
export const updateSettings = async (options: Partial<Settings>, save?: boolean): Promise<void> => {
  account.settings = {
    ...account.settings,
    ...options
  }
  if (save && session.password) await saveAccount(account, session.password)
}