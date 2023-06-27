import { View } from 'react-native'
import { Divider, PeachScrollView } from '../../components'
import tw from '../../styles/tailwind'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { CurrentFee } from './components/bumpNetworkFees/CurrentFee'
import { FeeEstimates } from './components/bumpNetworkFees/FeeEstimates'
import { NewFee } from './components/bumpNetworkFees/NewFee'
import { useBumpNetworkFeesSetup } from './hooks/useBumpNetworkFeesSetup'
import { BumpNetworkFeesButton } from './components/BumpNetworkFeesButton'

export const BumpNetworkFees = () => {
  const {
    transaction,
    currentFeeRate,
    newFeeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    estimatedFees,
    sendingAmount,
    overpayingBy,
  } = useBumpNetworkFeesSetup()

  if (!transaction) return <BitcoinLoading />

  return (
    <>
      <PeachScrollView
        style={tw`h-full w-full flex-1`}
        contentContainerStyle={[tw`justify-center flex-1 px-8`, tw.md`px-10`]}
        contentStyle={[tw`gap-3`, tw.md`gap-5`]}
      >
        <CurrentFee fee={currentFeeRate} />
        <Divider />
        <FeeEstimates {...{ estimatedFees, setFeeRate: setNewFeeRate, isOverpaying: overpayingBy >= 1 }} />
        <Divider />
        <NewFee {...{ newFeeRate, setNewFeeRate, overpayingBy }} />
      </PeachScrollView>
      <BumpNetworkFeesButton
        style={tw`self-center mb-5`}
        {...{ transaction, newFeeRate, sendingAmount }}
        disabled={!newFeeRateIsValid}
      />
    </>
  )
}
