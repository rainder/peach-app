import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Divider } from '../Divider'
import { MeansOfPaymentSelect } from '../trade'

type Props = {
  meansOfPayment: MeansOfPayment
}
export const PaymentMethodsSummary = ({ meansOfPayment }: Props) => (
  <View style={[tw`gap-2px`, tw.md`gap-2`]}>
    <Divider text={i18n('paymentMethods.title')} />
    <MeansOfPaymentSelect meansOfPayment={meansOfPayment} />
  </View>
)
