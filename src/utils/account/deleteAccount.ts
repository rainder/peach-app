import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { deleteFile, exists, readDir } from '../file'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'

interface DeleteAccountProps {
  onSuccess: Function
}

const accountFiles = [
  '/peach-account-identity.json',
  '/peach-account-settings.json',
  '/peach-account-tradingLimit.json',
  '/peach-account-paymentData.json',
  '/peach-account-offers.json',
  '/peach-account-contracts.json',
  '/peach-account-chats.json',
  '/peach-account.json',
]

const accountFolders = ['/peach-account-offers', '/peach-account-contracts']

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess }: DeleteAccountProps) => {
  info('Deleting account')

  setAccount(defaultAccount, true)

  accountFiles.forEach(async (file) => {
    if (await exists(file)) await deleteFile(file)
  })

  accountFolders.forEach(async (folder) => {
    if (!(await exists(folder))) return
    const files = await readDir(folder)
    await Promise.all(files.map((file) => deleteFile(file)))
  })

  logoutUser({})

  sessionStorage.removeItem('password')

  deleteAccessToken()
  deletePeachAccount()
  onSuccess()
  analytics().logEvent('account_deleted')
}
