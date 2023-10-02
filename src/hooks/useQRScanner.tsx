import { useState } from 'react'
import { Linking } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import { PERMISSIONS, RESULTS, request as requestPermission } from 'react-native-permissions'
import { Text } from '../components'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { ClosePopupAction } from '../popups/actions'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { isIOS } from '../utils/system'

type Props = {
  onSuccess: (data: string) => void
}
export const useQRScanner = ({ onSuccess }: Props) => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const showQR = () => {
    if (isIOS()) {
      requestPermission(PERMISSIONS.IOS.CAMERA).then((cameraStatus) => {
        if (cameraStatus === RESULTS.GRANTED) {
          setShowQRScanner(true)
        } else {
          setPopup(<MissingPermissionsPopup />)
        }
      })
    } else {
      setShowQRScanner(true)
    }
  }
  const closeQR = () => setShowQRScanner(false)
  const onRead = ({ data }: BarCodeReadEvent) => {
    onSuccess(data)
    closeQR()
  }

  return { showQRScanner, showQR, closeQR, onRead }
}

function MissingPermissionsPopup () {
  return (
    <PopupComponent
      title={i18n('settings.missingPermissions')}
      content={<Text>{i18n('settings.missingPermissions.text')}</Text>}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-1`} />
          <OpenSettingsAction />
        </>
      }
      bgColor={tw`bg-warning-background`}
      actionBgColor={tw`bg-warning-main`}
    />
  )
}

function OpenSettingsAction () {
  return (
    <PopupAction
      label={i18n('settings.openSettings')}
      textStyle={tw`text-black-1`}
      onPress={Linking.openSettings}
      iconId={'settingsGear'}
      reverseOrder
    />
  )
}
