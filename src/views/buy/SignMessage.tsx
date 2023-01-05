import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { GoBackButton, Input, Loading, PrimaryButton, Title, CopyAble } from '../../components'
import ProvideRefundAddress from '../../overlays/info/ProvideRefundAddress'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'

export default (): ReactElement => {
  const { message, peachWalletActive, submit, signatureField } = useSignMessageSetup()
  const [signature, setSignature, , signatureError] = signatureField
  const submitSignature = () => submit(signature)

  return peachWalletActive ? (
    <Loading />
  ) : (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title
        title={i18n('sell.title')}
        subtitle={i18n('offer.requiredAction.provideReturnAddress')}
        help={<ProvideRefundAddress />}
      />
      <View style={tw`h-full flex-shrink mt-12`}>
        <CopyAble value={message}></CopyAble>
        <Input
          style={tw`h-40`}
          {...{
            onChange: setSignature,
            value: signature,
            multiline: true,
            placeholder: i18n('form.signature'),
            autoCorrect: false,
            errorMessage: signatureError,
          }}
        />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <PrimaryButton style={tw`w-52`} disabled={!signature} onPress={submitSignature} narrow>
          {i18n(!signature ? 'buy.messageSigning.provideFirst' : 'confirm')}
        </PrimaryButton>
        <GoBackButton style={tw`w-52 mt-2`} />
      </View>
    </View>
  )
}
