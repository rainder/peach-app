import { setAccount, defaultAccount } from '.'
import { deleteFile } from '../file'
import { info } from '../log'

interface DeleteAccountProps {
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess, onError }: DeleteAccountProps) => {
  info('Deleting account')

  if (await deleteFile('/peach-account.json')) {
    setAccount(defaultAccount)
    onSuccess()
  } else {
    onError()
  }
}