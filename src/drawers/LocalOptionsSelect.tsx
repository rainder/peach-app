import React, { FC, ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { HorizontalLine, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import satispay from '../components/payment/logos/satispay.svg'
import mbWay from '../components/payment/logos/mbWay.svg'
import bizum from '../components/payment/logos/bizum.svg'
import { SvgProps } from 'react-native-svg'

type LocalOptionsProps = {
  local: {
    value: PaymentMethod
    display: string
  }[]
  onSelect: (localOption: PaymentMethod) => void
}

const icons: Record<string, FC<SvgProps>> = {
  satispay,
  mbWay,
  bizum,
}

export const LocalOptionsSelect = ({ local, onSelect }: LocalOptionsProps): ReactElement => (
  <View>
    {local.map(
      (
        localOption: {
          value: Partial<PaymentMethod>
          display: string
        },
        i,
      ) => {
        const SVG = icons[localOption.value]
        return (
          <Pressable key={i} onPress={() => onSelect(localOption.value)}>
            <View style={tw`flex flex-row items-center px-8`}>
              {SVG ? <SVG style={[tw`w-8 h-8 mr-4`]} /> : <Text>❌</Text>}
              <Text style={tw`flex-shrink w-full subtitle-1`}>
                {i18n(`paymentMethod.${localOption.value}`).toLowerCase()}
              </Text>
            </View>
            {i < local.length - 1 ? <HorizontalLine style={tw`my-6`} /> : null}
          </Pressable>
        )
      },
    )}
  </View>
)
