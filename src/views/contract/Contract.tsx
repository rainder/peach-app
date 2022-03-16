import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import * as bitcoin from 'bitcoinjs-lib'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Loading, Timer, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import getContractEffect from './effects/getContractEffect'
import { error, info } from '../../utils/log'
import { MessageContext } from '../../utils/message'
import i18n from '../../utils/i18n'
import { getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { confirmPayment } from '../../utils/peachAPI'
import { getOffer } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { TIMERS } from '../../constants'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import ContractDetails from './components/ContractDetails'
import Rate from './components/Rate'
import { verifyPSBT } from './helpers/verifyPSBT'
import { getTimerStart } from './helpers/getTimerStart'
import { parseContractForBuyer, parseContractForSeller } from './helpers/parseContract'
import { getRequiredAction } from './helpers/getRequiredAction'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// TODO check offer status (escrow, searching, matched, online/offline, what else?)
// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      let updatedContract: Contract = contract ? { ...contract, ...result } : result

      if (typeof contract?.paymentData === 'object') {
        updatedContract = {
          ...contract,
          ...result,
          paymentData: contract.paymentData
        }
      }

      const [parsedResult, err] = view === 'buyer'
        ? await parseContractForBuyer(updatedContract, result)
        : view === 'seller'
          ? await parseContractForSeller(updatedContract)
          : [updatedContract, null]

      if (err) {
        error(err, result.paymentData)
        updateMessage({
          msg: i18n('error.invalidPaymentData'),
          level: 'ERROR',
        })
        return
      }

      info('parsedResult.paymentData', parsedResult.paymentData)
      saveAndUpdate(parsedResult)
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(() => {
    setRequiredAction(getRequiredAction(contract))

    setUpdatePending(false)
  }, [contract])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [result, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentMade: new Date()
    })
  }

  const postConfirmPaymentSeller = async () => {
    if (!contract) return
    setLoading(true)

    const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer
    if (!sellOffer.id || !sellOffer?.funding) return

    const psbt = bitcoin.Psbt.fromBase64(contract.releaseTransaction, { network: getNetwork() })

    // Don't trust the response, verify
    const errorMsg = verifyPSBT(psbt, sellOffer, contract)

    if (errorMsg.length) {
      setLoading(false)
      updateMessage({
        msg: errorMsg.join('\n'),
        level: 'WARN',
      })
      return
    }

    // Sign psbt
    psbt.signInput(0, getEscrowWallet(sellOffer.id))

    const tx = psbt
      .finalizeInput(0, getFinalScript)
      .extractTransaction()
      .toHex()

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || ''
    })
  }

  return updatePending
    ? <Loading />
    : <ScrollView style={tw`pt-6`}>
      <View style={tw`pb-32`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
          subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
        />
        {contract && !contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <Timer
              text={i18n(`contract.timer.${requiredAction}`)}
              start={getTimerStart(contract, requiredAction)}
              duration={TIMERS[requiredAction]}
            />
            <ContractDetails contract={contract} view={view} />
            <Button
              style={tw`mt-4`}
              title={i18n('chat')}
              secondary={true}
            />
            {view === 'buyer' && requiredAction === 'paymentMade'
              ? <Button
                disabled={loading}
                onPress={postConfirmPaymentBuyer}
                style={tw`mt-2`}
                title={i18n('contract.payment.made')}
              />
              : null
            }
            {view === 'seller' && requiredAction === 'paymentConfirmed'
              ? <Button
                disabled={loading}
                onPress={postConfirmPaymentSeller}
                style={tw`mt-2`}
                title={i18n('contract.payment.received')}
              />
              : null
            }
          </View>
          : null
        }
        {contract && contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <Rate contract={contract} view={view} navigation={navigation} />
          </View>
          : null
        }
      </View>
    </ScrollView>
}