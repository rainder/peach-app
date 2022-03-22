import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext from '../../utils/bitcoin'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../utils/message'
import { BigTitle, Button, Loading, Matches, Text } from '../../components'
import searchForPeersEffect from '../../effects/searchForPeersEffect'
import { thousands } from '../../utils/string'
import { saveOffer } from '../../utils/offer'
import { matchOffer, unmatchOffer } from '../../utils/peachAPI/private/offer'
import { error, info } from '../../utils/log'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { OverlayContext } from '../../utils/overlay'
import { cancelOffer } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp'
import ConfirmCancelTrade from './components/ConfirmCancelTrade'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer,
  } }>,
  navigation: ProfileScreenNavigationProp,
}
// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [, updateMessage] = useContext(MessageContext)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [offer, setOffer] = useState<BuyOffer|SellOffer>(route.params.offer)
  const [offerId, setOfferId] = useState<string|undefined>(route.params.offer.id)
  const [updatePending, setUpdatePending] = useState(true)

  const [matches, setMatches] = useState<Match[]>([])

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    setOffer(offerData)
    setOfferId(offerData.id)
    saveOffer(offerData)
  }

  // eslint-disable-next-line max-statements
  const toggleMatch = async (match: Match) => {
    let result: any
    let err

    if (!offer.id) return

    if (!match.matched) {
      let encryptedResult

      if (offer.type === 'ask') {
        const paymentData = offer.paymentData.find(data => data.type === match.paymentMethods[0])
        if (!paymentData) {
          error('Error', err)
          // TODO show payment Data form again
          updateMessage({
            msg: i18n('search.error.paymentDataMissing'),
            level: 'ERROR',
          })
          return
        }
        delete paymentData.selected
        encryptedResult = await signAndEncrypt(
          JSON.stringify(paymentData),
          match.user.pgpPublicKey
        )
      }
      [result, err] = await matchOffer({
        offerId: offer.id,
        matchingOfferId: match.offerId,
        currency: Object.keys(match.prices)[0] as Currency,
        paymentMethod: match.paymentMethods[0],
        paymentDataEncrypted: encryptedResult?.encrypted,
        paymentDataSignature: encryptedResult?.signature,
      })
    } else if (offer.type === 'bid') {
      [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })
    }

    if (result) {
      setMatches(() => matches.map(m => ({
        ...m,
        matched: m.offerId === match.offerId ? !m.matched : m.matched
      })))

      if (offer.type === 'ask') {
        saveAndUpdate({ ...offer, doubleMatched: true, contractId: result.contractId })

        if (result.contractId) navigation.navigate('contract', { contractId: result.contractId })
      }
    } else {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  const confirmCancelTrade = async () => {
    if (!offer.id) return

    const [result, err] = await cancelOffer({
      offerId: offer.id,
      satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })
    if (result) {
      info('Cancel offer: ', JSON.stringify(result))
      if (offer.type === 'ask' && offer.funding) {
        saveAndUpdate({
          ...offer, online: false,
          funding: {
            ...offer.funding,
            status: 'CANCELED',
          }
        })
      } else {
        saveAndUpdate({ ...offer, online: false })
      }
    } else if (err) {
      error('Error', err)
    }
  }

  const cancelTrade = () => updateOverlay({
    content: <ConfirmCancelTrade offer={offer} confirm={confirmCancelTrade} navigation={navigation} />,
    showCloseButton: false
  })

  useEffect(() => {
    setOffer(route.params.offer)
    setOfferId(route.params.offer.id)
    setUpdatePending(() => true)
  }, [route])

  useEffect(() => {
    if (!offer.id) return

    const matchedOffers = matches.filter(m => m.matched).map(m => m.offerId)

    saveAndUpdate({ ...offer, matches: matchedOffers })
  }, [matches])

  useEffect(getOfferDetailsEffect({
    offerId,
    interval: offer.type === 'bid' ? 30 * 1000 : 0,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      })

      if (result.contractId) {
        navigation.navigate('contract', { contractId: result.contractId })
      }
      setUpdatePending(() => false)
    },
    onError: err => {
      error('Could not fetch offer information for offer', offer.id)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offerId])

  useEffect(!updatePending ? searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => result.map(m => ({
        ...m,
        matched: offer.matches && offer.matches.indexOf(m.offerId) !== -1
      })))
    },
    onError: err => updateMessage({ msg: i18n(err.error), level: 'ERROR' }),
  }) : () => {}, [updatePending])

  useEffect(() => 'escrow' in offer && offer.funding?.status !== 'FUNDED'
    ? checkFundingStatusEffect({
      offer,
      onSuccess: result => {
        info('Checked funding status', result)

        saveAndUpdate({
          ...offer,
          funding: result.funding,
          returnAddress: result.returnAddress,
          depositAddress: offer.depositAddress || result.returnAddress,
        })
      },
      onError: err => {
        updateMessage({
          msg: i18n(err.error || 'error.general'),
          level: 'ERROR',
        })
      },
    })() : () => {}, [offer.id])

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`h-full flex justify-center pb-8`}>
        <BigTitle title={i18n(matches.length ? 'search.youGotAMatch' : 'search.searchingForAPeer')} />
        {offer.type === 'ask' && !matches.length
          ? <View>
            <Text style={tw`text-center`}>
              {i18n('search.sellOffer.1')}
            </Text>
            <Text style={tw`text-center mt-2`}>
              {i18n('search.sellOffer.2')}
            </Text>
          </View>
          : null
        }
        {offer.type === 'bid' && matches.length
          ? <Text style={tw`text-grey-3 text-center -mt-2`}>
            {i18n('search.buyOffer', thousands(offer.amount))}
          </Text>
          : null
        }
        {matches.length
          ? <View>
            <Matches style={tw`mt-9`} matches={matches} onChange={setCurrentMatch}/>
            <View style={tw`flex items-center mt-6`}>
              <Button
                title={i18n('search.matchOffer')}
                wide={false}
                onPress={() => toggleMatch(matches[currentMatch])}
              />
            </View>
          </View>
          : <View style={tw`flex items-center mt-6`}>
            <Button
              title={i18n('goBackHome')}
              wide={false}
              onPress={() => navigation.navigate('home', {})}
            />
          </View>
        }
        <Pressable style={tw`mt-4`} onPress={cancelTrade}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
            {i18n('cancelTrade')}
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
}
