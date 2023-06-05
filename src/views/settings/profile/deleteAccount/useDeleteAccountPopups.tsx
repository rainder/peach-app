import { CommonActions } from '@react-navigation/native'
import { useCallback } from 'react'
import { usePopupStore } from '../../../../store/usePopupStore'
import { deleteAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { logoutUser } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'

export const useDeleteAccountPopups = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showOverlay = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      setPopup({
        visible: true,
        title: i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`),
        content,
        level: 'ERROR',
        action2:
          !isSuccess && callback
            ? {
              label: i18n('settings.deleteAccount'),
              icon: 'trash',
              callback,
            }
            : undefined,
      }),
    [setPopup],
  )

  const deleteAccountClicked = async () => {
    await deleteAccount()
    logoutUser({})
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'welcome' }],
    })
    showOverlay(<DeleteAccountPopup title={'success'} />, undefined, true)
  }

  const showForRealsiesPopup = () => {
    showOverlay(<DeleteAccountPopup title={'forRealsies'} />, deleteAccountClicked)
  }
  const showDeleteAccountPopup = () => {
    showOverlay(<DeleteAccountPopup title={'popup'} />, showForRealsiesPopup)
  }

  return showDeleteAccountPopup
}
