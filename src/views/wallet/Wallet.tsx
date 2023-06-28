import { RefreshControl, View } from 'react-native'
import { PeachScrollView } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { ConfirmSendAllTo } from './components/overview/ConfirmSendAllTo'
import { SendTo } from './components/overview/SendTo'
import { TotalBalance } from './components/overview/TotalBalance'
import { useWalletSetup } from './hooks/useWalletSetup'

export default () => {
  const { balance, refresh, isRefreshing, address, setAddress, addressErrors, canWithdrawAll, walletLoading }
    = useWalletSetup({ syncOnLoad: true })

  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <View style={[tw`flex-1 px-4`, tw.md`px-8`]}>
      <PeachScrollView
        style={tw`flex-1 h-full`}
        contentContainerStyle={tw`flex-1`}
        contentStyle={tw`flex-1 items-center justify-center gap-16`}
        refreshControl={<RefreshControl style={tw`opacity-0`} refreshing={false} onRefresh={refresh} />}
      >
        <TotalBalance amount={balance} isRefreshing={isRefreshing} />
        <SendTo {...{ address, setAddress, addressErrors }} />
      </PeachScrollView>

      <ConfirmSendAllTo
        style={tw`self-center mb-5`}
        address={address}
        onSuccess={() => setAddress('')}
        disabled={!canWithdrawAll}
      />
    </View>
  )
}
