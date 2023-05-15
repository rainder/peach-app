import { ReactElement } from 'react'
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { ParsedPeachText } from '../../text'
import { CustomAmount } from './CustomAmount'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { useSelectAmountSetup } from './hooks/useSelectAmountSetup'

type Props = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, style }: Props): ReactElement => {
  const { amount, updateCustomAmount, pan, panResponder, trackRange, onTrackLayout } = useSelectAmountSetup({
    min,
    max,
    value,
    onChange,
  })
  return (
    <View style={[tw`flex-row items-center justify-between pl-5 pr-4`, style]}>
      <View style={[tw`flex-shrink items-start gap-2`, tw.md`gap-4`]}>
        <ParsedPeachText
          style={[tw`h7`, tw.md`h5`]}
          parse={[{ pattern: new RegExp(i18n('sell.subtitle.highlight'), 'u'), style: tw`text-primary-main` }]}
        >
          {i18n('sell.subtitle')}
        </ParsedPeachText>
        <CustomAmount
          {...{
            amount,
            onChange: updateCustomAmount,
          }}
          style={tw`flex-shrink items-start`}
        />
      </View>
      <SliderTrack style={tw`h-full`} onLayout={onTrackLayout}>
        <TrackMarkers />
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
