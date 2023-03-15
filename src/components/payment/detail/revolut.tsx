import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import { APPLINKS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'
import { CopyAble } from '../../ui'

const possibleFields: (keyof RevolutData)[] = ['phone', 'userName', 'email']
export const DetailRevolut = ({
  paymentData,
  appLink,
  fallbackUrl,
  copyable,
  style,
}: PaymentTemplateProps): ReactElement => {
  const openApp = () => (fallbackUrl ? openAppLink(fallbackUrl, appLink) : {})
  const openUserLink = async () => openAppLink(`${APPLINKS.revolut.userLink}${paymentData.userName.replace('@', '')}`)
  const onInfoPress = (field: string) => {
    if (field === 'userName') {
      openUserLink()
    } else if (appLink || fallbackUrl) {
      openApp()
    }
  }

  return (
    <View style={style}>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>
        <View>
          {possibleFields
            .filter((field) => paymentData[field])
            .map((field, i) => (
              <View key={'paymentDetails-' + field} style={i > 0 && tw`mt-[2px]`}>
                <View style={tw`flex-row items-center justify-end`}>
                  <Text onPress={() => onInfoPress(field)} style={tw`subtitle-1`}>
                    {paymentData[field]}
                  </Text>
                  {copyable && <CopyAble value={paymentData[field]} style={tw`ml-2`} />}
                </View>
              </View>
            ))}
        </View>
      </View>
      <View style={[tw`flex-row justify-between mt-2`]}>
        <Text style={tw`text-black-2`}>{i18n('contract.summary.reference')}</Text>
        <View style={[tw`flex-row items-center justify-end`, !paymentData.reference && tw`opacity-50`]}>
          <Text style={tw`subtitle-1`}>{paymentData.reference || i18n('none')}</Text>
          {copyable && <CopyAble value={paymentData.reference} style={tw`ml-2`} />}
        </View>
      </View>
    </View>
  )
}
export default DetailRevolut
