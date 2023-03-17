import React, { ReactElement } from 'react'
import 'react-native-url-polyfill/auto'

import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { openInWallet } from '../../utils/bitcoin'
import { info } from '../../utils/log'

type OpenWalletProps = ComponentProps & {
  address?: string
}

export const OpenWallet = ({ address }: OpenWalletProps): ReactElement => {
  info(`bitcoin:${address}`)
  const openWalletApp = () => openInWallet(`bitcoin:${address ?? ''}`)

  return (
    <TouchableOpacity style={tw`flex-row items-center justify-center`} onPress={openWalletApp}>
      <Text style={tw`underline uppercase body-s text-black-2`}>{i18n('wallet.openWalletApp')}</Text>
      <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw`text-primary-main`.color} />
    </TouchableOpacity>
  )
}
export default OpenWallet
