import { storeAccount } from '../utils/account'
import { accountStorage } from '../utils/account/accountStorage'
import { loadAccountFromFileSystem } from '../utils/account/loadAccount/loadAccountFromFileSystem'
import { sessionStorage } from '../utils/session'

const migrateAccountToSecureStorage = async () => {
  const password = sessionStorage.getString('password')
  let account
  if (password) account = await loadAccountFromFileSystem(password)
  if (account) storeAccount(account)
}

export const dataMigration = async () => {
  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage()
  }
}
