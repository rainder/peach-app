import { useMemo } from 'react'
import tw from '../../../../styles/tailwind'
import { getPaymentMethodName } from '../../../../utils/paymentMethod/getPaymentMethodName'
import { Icon } from '../../../Icon'
import { Text } from '../../../text'

type Props = {
  isSelected: boolean
  isVerified: boolean
  name: PaymentMethod
}

export const PaymentMethodSelectorText = ({ isSelected, isVerified, name }: Props) => {
  const paymentMethodName = useMemo(() => (name ? getPaymentMethodName(name) : 'undefined'), [name])
  return (
    <>
      <Text style={[tw`self-center button-medium text-black-3`, isSelected && tw`text-primary-background-light`]}>
        {paymentMethodName}
      </Text>
      {isVerified && (
        <Icon
          id="userCheck"
          style={tw`w-3 h-3 ml-1`}
          color={isSelected ? tw.color('primary-background-light') : tw.color('black-3')}
        />
      )}
    </>
  )
}
