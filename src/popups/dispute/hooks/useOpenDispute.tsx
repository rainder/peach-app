import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup/PopupAction'
import { useNavigation } from '../../../hooks/useNavigation'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { WarningPopup } from '../../WarningPopup'
import { ClosePopupAction } from '../../actions/ClosePopupAction'
import { OpenDispute } from '../components/OpenDispute'

export const useOpenDispute = (contractId: string) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const ok = useCallback(() => {
    closePopup()
    navigation.navigate('disputeReasonSelector', { contractId })
  }, [closePopup, contractId, navigation])

  const showOpenDisputePopup = useCallback(() => {
    setPopup(
      <WarningPopup
        title={i18n('dispute.openDispute')}
        content={<OpenDispute />}
        actions={
          <>
            <PopupAction
              label={i18n('dispute.openDispute')}
              iconId="alertOctagon"
              onPress={ok}
              textStyle={tw`text-black-100`}
            />
            <ClosePopupAction reverseOrder textStyle={tw`text-black-100`} />
          </>
        }
      />,
    )
  }, [setPopup, ok])

  return showOpenDisputePopup
}
