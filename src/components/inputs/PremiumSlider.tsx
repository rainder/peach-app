import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow } from 'react-native-shadow-2'
import { mildShadow } from '../../utils/layoutUtils'
import { Text } from '..'

interface PremiumSliderProps {
  value: number,
  min: number,
  max: number,
  onChange?: (value: number) => void
}

/**
 * @description Component to display premium slider
 * @param props Component properties
 * @param props.value current value
 * @param props.min minimum value
 * @param props.max maximum value
 * @param props.value current value
 * @param [props.onChange] on change handler
 * @example
 */
export const PremiumSlider = ({ value, min, max, onChange }: PremiumSliderProps): ReactElement => {
  const [delta] = useState(max - min)
  const [markerX] = useState((value - min) / delta)
  let trackWidth = useRef(260).current
  const pan = useRef(new Animated.Value(markerX * trackWidth)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [null, { dx: pan }],
          { useNativeDriver: false }
        )(e, gestureState)
      },
      onPanResponderRelease: () => pan.extractOffset(),
      onShouldBlockNativeResponder: () => true
    })
  ).current

  useEffect(() => {
    pan.extractOffset()
    pan.addListener((props) => {
      if (onChange) {
        const boundedX = props.value < 0 ? 0 : Math.min(props.value, trackWidth)
        const val = Math.round((boundedX / trackWidth * delta + min) * 10) / 10
        onChange(val)
      }
    })

    return () => pan.removeAllListeners()
  }, [])


  return <View {...panResponder.panHandlers}>
    <Shadow {...mildShadow} viewStyle={tw`w-full`}>
      <View style={tw`p-5 pt-3 bg-white-1 border border-grey-4 rounded`}>
        <View style={tw`w-full flex-row justify-between`}>
          <Text style={tw`font-baloo text-xs text-red`}>{min}%</Text>
          <Text style={tw`font-baloo text-xs text-grey-2`}>
            market price
          </Text>
          <Text style={tw`font-baloo text-xs text-green`}>+{max}%</Text>
        </View>
        <View style={tw`h-0 mx-3 flex-row items-center mt-2 border-2 border-grey-4 rounded`}
          onLayout={event => trackWidth = event.nativeEvent.layout.width}>
          <Animated.View style={[
            tw`z-10`,
            {
              marginLeft: -tw`w-6`.width / 2,
              transform: [
                {
                  translateX: pan.interpolate({
                    inputRange: [0, trackWidth],
                    outputRange: [0, trackWidth],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }
          ]}>
            <Icon id="triangleUp" style={tw`w-6 h-6`} />
          </Animated.View>
        </View>
      </View>
    </Shadow>
  </View>
}

export default PremiumSlider