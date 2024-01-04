import { View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Toggle } from '../../components/inputs'
import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useTransactionBatchingSetup } from './hooks/useTransactionBatchingSetup'

export const TransactionBatching = () => {
  const { isLoading, isBatchingEnabled, toggleBatching } = useTransactionBatchingSetup()

  if (isLoading) return <LoadingScreen />
  return (
    <Screen style={tw`justify-center gap-8`} header={i18n('settings.transactionBatching')}>
      <View style={tw`gap-4`}>
        <PeachText style={tw`body-l`}>
          {i18n(isBatchingEnabled ? 'settings.batching.delayedPayouts' : 'settings.batching.immediatePayouts')}
        </PeachText>
        <ParsedPeachText
          style={tw`body-l`}
          parse={[
            {
              pattern: new RegExp(
                i18n(isBatchingEnabled ? 'settings.batching.youSave.highlight' : 'settings.batching.youPay.highlight'),
                'u',
              ),
              style: tw`text-primary-main`,
            },
          ]}
        >
          {i18n.break(isBatchingEnabled ? 'settings.batching.youSave' : 'settings.batching.youPay')}
        </ParsedPeachText>
      </View>
      <Toggle enabled={isBatchingEnabled} onPress={toggleBatching}>
        {i18n('settings.batching.toggle')}
      </Toggle>
    </Screen>
  )
}
