import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '../features/counter/counterSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CounterScreen() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Redux Toolkit Demo</Text>

        <Text style={styles.counter}>Count: {count}</Text>

        <Button title="Increment" onPress={() => dispatch(increment())} />

        <Button title="Decrement" onPress={() => dispatch(decrement())} />

        <Button title="Add 5" onPress={() => dispatch(incrementByAmount(5))} />

        <Button title="Reset" onPress={() => dispatch(reset())} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counter: {
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 12,
  },
});
