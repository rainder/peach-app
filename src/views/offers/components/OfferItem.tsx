import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Bubble, SatsFormat, Text } from '../../../components'
import Icon from '../../../components/Icon'
import { OverlayContext } from '../../../contexts/overlay'
import Refund from '../../../overlays/Refund'
import tw from '../../../styles/tailwind'
import { getContractChatNotification } from '../../../utils/chat'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getOfferStatus } from '../../../utils/offer'
import { ProfileScreenNavigationProp } from '../Offers'


const navigateToOffer = (
  offer: SellOffer|BuyOffer,
  offerStatus: OfferStatus,
  navigation: ProfileScreenNavigationProp,
  updateOverlay: React.Dispatch<OverlayState>
// eslint-disable-next-line max-params
): void => {
  const navigate = () => navigation.replace('offers', {})

  if (offer.type === 'ask'
    && offer.funding.txId
    && !offer.refunded
    && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    // return navigation.replace('refund', { offer })
    return updateOverlay({
      content: <Refund offer={offer} navigate={navigate} />,
      showCloseButton: false
    })
  }

  if (!/rate/u.test(offerStatus.requiredAction)
    && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(offerStatus.status)) {
    return navigation.replace('offer', { offer })
  }

  if (offer.contractId) {
    const contract = getContract(offer.contractId)
    if (contract && offerStatus.status === 'tradeCompleted') {
      return navigation.replace('tradeComplete', { contract })
    }
    return navigation.replace('contract', { contractId: offer.contractId })
  }

  if (offer.type === 'ask') {
    if (offer.funding.status === 'FUNDED') {
      return navigation.replace('search', { offer })
    }
    return navigation.replace('sell', { offer })
  }

  if (offer.type === 'bid' && offer.online) {
    return navigation.replace('search', { offer })
  }

  return navigation.replace('offers', {})
}

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer,
  showType?: boolean,
  navigation: ProfileScreenNavigationProp,
}

type IconMap = { [key in OfferStatus['status']]?: string }
  & { [key in OfferStatus['requiredAction']]?: string }

const ICONMAP: IconMap = {
  offerPublished: 'clock',
  searchingForPeer: 'clock',
  escrowWaitingForConfirmation: 'fundEscrow',
  fundEscrow: 'fundEscrow',
  match: 'heart',
  offerCanceled: 'cross',
  sendPayment: 'money',
  confirmPayment: 'money',
  rate: 'check',
  contractCreated: 'money',
  tradeCompleted: 'check',
  tradeCanceled: 'cross',
}

export const OfferItem = ({ offer, showType = true, navigation, style }: OfferItemProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { status, requiredAction } = getOfferStatus(offer)
  const icon = ICONMAP[requiredAction] || ICONMAP[status]
  const contract = offer.contractId ? getContract(offer.contractId) : null
  const notifications = contract ? getContractChatNotification(contract) : 0

  return <Pressable onPress={() => navigateToOffer(offer, { status, requiredAction }, navigation, updateOverlay)}
    style={[
      tw`pl-4 pr-2 py-2 rounded`,
      requiredAction ? tw`bg-peach-1` : tw`bg-white-1 border border-grey-2`,
      style
    ]}>
    <View style={tw`flex-row justify-between items-center`}>
      <View style={tw`flex-row`}>
        {showType
          ? <View style={tw`pr-1`}>
            <Text style={[
              tw`text-lg font-bold uppercase`,
              requiredAction ? tw`text-white-1` : tw`text-grey-2`
            ]}>
              {i18n(offer.type === 'ask' ? 'sell' : 'buy')}
            </Text>
          </View>
          : null
        }
        <SatsFormat
          style={tw`text-lg font-bold`}
          sats={offer.amount}
          color={requiredAction ? tw`text-white-1` : tw`text-grey-1`}
          color2={requiredAction ? tw`text-peach-mild` : tw`text-grey-3`} />
      </View>
      <Icon id={icon || 'help'} style={tw`w-5 h-5`}
        color={(requiredAction ? tw`text-white-1` : tw`text-grey-2`).color as string}
      />
    </View>
    {notifications > 0
      ? <Bubble color={tw`text-green`.color as string}
        style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}>
        <Text style={tw`text-sm font-baloo text-white-1 text-center`}>{notifications}</Text>
      </Bubble>
      : null
    }
  </Pressable>
}