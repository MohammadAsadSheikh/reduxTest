import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/app/store';
import CounterScreen from './src/screens/CounterScreen';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <CounterScreen />
      </SafeAreaProvider>
    </Provider>
  );
}
