import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CounterScreen from '../screens/CounterScreen';
import UsersScreen from '../screens/UsersScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Counter"
      screenOptions={{
        headerShown: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="Counter" component={CounterScreen} />

      <Tab.Screen name="Users" component={UsersScreen} />

      <Tab.Screen name="Account" component={LoginScreen} />
    </Tab.Navigator>
  );
}
