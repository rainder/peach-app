import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import { PAYMENTCATEGORIES } from '../../constants'
import tw from '../../styles/tailwind'
import { removePaymentData } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getPaymentMethodInfo, isValidPaymentData } from '../../utils/paymentMethod'
import { PaymentDetailsCheckbox, CheckboxType } from './PaymentDetailsCheckbox'
import LinedText from '../ui/LinedText'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { PaymentDataKeyFacts } from './components/PaymentDataKeyFacts'

const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
  value: data.id,
  display: <Text style={tw`subtitle-1`}>{data.label}</Text>,
  isValid: isValidPaymentData(data),
  data,
})

const paymentCategoryIcons: Record<PaymentCategory, IconType | ''> = {
  bankTransfer: 'inbox',
  onlineWallet: 'cloud',
  giftCard: 'creditCard',
  localOption: 'flag',
  cash: '',
  cryptoCurrency: '',
}

const belongsToCategory = (category: PaymentCategory) => (data: PaymentData) =>
  PAYMENTCATEGORIES[category].includes(data.type)
  && !(category === 'localOption' && data.type === 'mobilePay' && data.currencies[0] === 'DKK')
  && !(category === 'onlineWallet' && data.type === 'mobilePay' && data.currencies[0] === 'EUR')

type Props = {
  paymentData: PaymentData[]
  editing: boolean
  editItem: (data: PaymentData) => void
  select: (value: string) => void
  isSelected: (item: CheckboxType) => boolean
}

export const RemotePaymentDetails = ({ paymentData, editing, editItem, select, isSelected }: Props) => {
  const [, setRandom] = useState(0)
  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id)
    setRandom(Math.random())
  }
  return paymentData.filter((item) => !isCashTrade(item.type)).length === 0 ? (
    <Text style={tw`text-center h6 text-black-3`}>{i18n('paymentMethod.empty')}</Text>
  ) : (
    <View testID={'checkboxes-buy-mops'}>
      {(Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
        .map((category) => ({
          category,
          checkboxes: paymentData
            .filter((item) => !item.hidden)
            .filter((item) => !isCashTrade(item.type))
            .filter(belongsToCategory(category))
            .filter((data) => getPaymentMethodInfo(data.type))
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map(mapPaymentDataToCheckboxes),
        }))
        .filter(({ checkboxes }) => checkboxes.length)
        .map(({ category, checkboxes }, i) => (
          <View key={category} style={i > 0 ? tw`mt-8` : {}}>
            <LinedText style={tw`pb-3`}>
              <Text style={tw`mr-1 h6 text-black-2`}>{i18n(`paymentCategory.${category}`)}</Text>
              {paymentCategoryIcons[category] !== '' && (
                <Icon color={tw`text-black-2`.color} id={paymentCategoryIcons[category] as IconType} />
              )}
            </LinedText>
            {checkboxes.map((item, j) => (
              <View key={item.data.id} style={j > 0 ? tw`mt-4` : {}}>
                {item.isValid ? (
                  <View>
                    <PaymentDetailsCheckbox
                      testID={`buy-mops-checkbox-${item.value}`}
                      onPress={() => (editing ? editItem(item.data) : select(item.value))}
                      item={item}
                      checked={isSelected(item)}
                      editing={editing}
                    />
                    <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
                  </View>
                ) : (
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`font-baloo text-error-main`}>{item.data.label}</Text>
                    <Pressable onPress={() => deletePaymentData(item.data)} style={tw`w-6 h-6`}>
                      <Icon id="trash" style={tw`w-6 h-6`} color={tw`text-black-2`.color} />
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
    </View>
  )
}
