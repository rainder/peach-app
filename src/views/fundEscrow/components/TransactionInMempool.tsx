import { NETWORK } from '@env'
import { networks } from 'bitcoinjs-lib'
import { useMemo, useState } from 'react'
import { Image, LayoutChangeEvent, TouchableOpacity, View } from 'react-native'
import txInMempool from '../../../assets/escrow/tx-in-mempool.png'
import { Header, Icon, Screen, Text } from '../../../components'
import { TradeInfo } from '../../../components/offer'
import { useCancelOffer, useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout'
import { getOffer } from '../../../utils/offer'
import { generateBlock } from '../../../utils/regtest'
import { getNetwork } from '../../../utils/wallet'

type Props = {
  offerId: string
  txId: string
}

const DEFAULT_WIDTH = 300
const ASPECT_RATIO = 0.7

export const TransactionInMempool = ({ offerId, txId }: Props) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const openInExplorer = () => showTransaction(txId, NETWORK)
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)

  return (
    <Screen header={<MempoolHeader {...{ offerId }} />}>
      <View style={tw`justify-center gap-3 grow shrink`}>
        <Text>{i18n('sell.funding.mempool.description')}</Text>
        <View {...{ onLayout }} testID="image-container">
          <Image source={txInMempool} style={{ width, height: width * ASPECT_RATIO }} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={openInExplorer}>
          <TradeInfo
            style={tw`self-center`}
            text={i18n('showInExplorer')}
            textStyle={tw`underline`}
            IconComponent={<Icon id="externalLink" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

function MempoolHeader ({ offerId }: { offerId: string }) {
  const showHelp = useShowHelp('mempool')
  const offer = getOffer(offerId)
  const cancelOffer = useCancelOffer(offer)

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [
      { ...headerIcons.help, onPress: showHelp },
      { ...headerIcons.cancel, onPress: cancelOffer },
    ]

    if (getNetwork() === networks.regtest) {
      icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock })
    }
    return icons
  }, [cancelOffer, showHelp])

  return <Header title={i18n('sell.funding.mempool.title')} icons={memoizedHeaderIcons} />
}
