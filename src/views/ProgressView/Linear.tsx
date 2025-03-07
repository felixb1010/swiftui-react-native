import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Modifiers } from '../../utils/modifiers';
import { getCornerRadius } from '../../utils/cornerRadius';
import { getPadding } from '../../utils/padding';
import { getBorder } from '../../utils/border';
import { getShadow } from '../../utils/shadow';
import { getSliderWidth, value2Position } from '../Slider/utils';
import { useLifecycle } from '../../hooks/useLifecycle';
import { getTransform } from '../../utils/transform';
import { useColorScheme } from '../../hooks/useColorScheme';
import { UIColor, getColor } from '../../utils/colors';
import { useAlert } from '../../hooks/useAlert';

type LinearProps = Modifiers & {
  value: number;
  total?: number;
  tint?: UIColor;
};

export const Linear = ({
  value,
  total = 100,
  backgroundColor,
  opacity,
  frame,
  cornerRadius,
  rotationEffect,
  scaleEffect,
  padding,
  border,
  shadow,
  zIndex,
  style,
  tint,
  alert,
  onAppear,
  onDisappear,
}: LinearProps) => {
  useAlert(alert);
  useLifecycle(onAppear, onDisappear);
  const colorScheme = useColorScheme();
  const [sliderWidth, sliderHeight] = getSliderWidth(frame);
  const midPoint = total / 2;
  const slope = midPoint / (sliderWidth / 2);
  const progress = useSharedValue(value2Position(value, midPoint, slope));

  useEffect(() => {
    if (value > total) {
      progress.value = withTiming(value2Position(total, midPoint, slope));
    } else if (value < 0) {
      progress.value = withTiming(0);
    } else {
      const newPos = value2Position(value, midPoint, slope);
      progress.value = withTiming(newPos);
    }
  }, [value, total]);

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: progress.value + sliderWidth / 2,
    };
  }, [progress.value]);

  return (
    <View
      style={[
        {
          opacity,
          zIndex,
          backgroundColor: getColor(backgroundColor, colorScheme),
          ...getCornerRadius(cornerRadius),
          ...getPadding(padding),
          ...getBorder(border),
          ...getShadow(shadow),
          ...getTransform(scaleEffect, rotationEffect),
        },
        style,
      ]}
    >
      <View
        style={[
          styles.progressBar,
          {
            width: sliderWidth,
            height: sliderHeight,
            backgroundColor: getColor('systemGray4', colorScheme),
          },
        ]}
      >
        <Animated.View
          style={[
            {
              height: sliderHeight,
              borderRadius: 10,
              backgroundColor: getColor(tint, colorScheme, 'systemBlue'),
            },
            animatedFillStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    borderRadius: 10,
  },
});
