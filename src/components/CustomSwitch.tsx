import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

type CustomSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;
const THUMB_PADDING = 3;

const CustomSwitch = ({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel = 'Preference toggle',
}: CustomSwitchProps) => {
  const translateX = useRef(
    new Animated.Value(
      value ? TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING : THUMB_PADDING,
    ),
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING : THUMB_PADDING,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[styles.track, value ? styles.trackEnabled : styles.trackDisabled]}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    padding: 0,
  },
  trackEnabled: {
    backgroundColor: '#3458C8',
  },

  trackDisabled: {
    backgroundColor: '#D1D5DB',
  },
  thumb: {
    position: 'absolute',
    top: THUMB_PADDING,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomSwitch;
