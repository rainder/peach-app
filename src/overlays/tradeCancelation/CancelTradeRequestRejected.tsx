import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { contractIdToHex, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const CancelTradeRequestRejected = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  useEffect(() => {
    saveContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }, [])

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-xl leading-8 text-center text-white-1 font-baloo`}>
        {i18n('contract.cancel.seller.rejected.title')}
      </Headline>
      <Text style={tw`mt-8 text-center text-white-1`}>
        {i18n('contract.cancel.seller.rejected.text.1', contractIdToHex(contract.id))}
      </Text>
      <Text style={tw`mt-2 text-center text-white-1`}>{i18n('contract.cancel.seller.rejected.text.2')}</Text>
      <View>
        <Button style={tw`mt-8`} title={i18n('close')} secondary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
