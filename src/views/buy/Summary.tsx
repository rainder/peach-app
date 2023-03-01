import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { BuyOfferSummary, PeachScrollView, PrimaryButton } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BuyViewProps } from './BuyPreferences'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'

export default ({ offerDraft, setOfferDraft }: BuyViewProps): ReactElement => {
  const {
    releaseAddress,
    walletLabel,
    message,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToSetupPayoutWallet,
  } = useBuySummarySetup()
  const publishBuyOffer = () => publishOffer(offerDraft)

  useEffect(() => {
    if (releaseAddress) setOfferDraft((prev) => ({
      ...prev,
      releaseAddress,
      message,
      messageSignature,
    }))
  }, [releaseAddress, message, messageSignature, setOfferDraft])

  useEffect(() => {
    if (walletLabel) setOfferDraft((prev) => ({
      ...prev,
      walletLabel,
    }))
  }, [walletLabel, setOfferDraft])

  return (
    <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-8 pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <BuyOfferSummary offer={offerDraft} />
      </View>
      <PrimaryButton
        testID="navigation-next"
        style={tw`self-center mt-4`}
        narrow={!canPublish}
        onPress={canPublish ? publishBuyOffer : goToSetupPayoutWallet}
        iconId={canPublish ? 'uploadCloud' : undefined}
        loading={isPublishing}
      >
        {i18n(canPublish ? 'offer.publish' : 'next')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
