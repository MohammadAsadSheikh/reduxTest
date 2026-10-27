import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import CounterScreen from '../screens/CounterScreen';
import UsersScreen from '../screens/UsersScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarActiveTintColor: '#3458C8',
        tabBarInactiveTintColor: '#929DB0',
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 6,
          borderTopColor: '#E5EAF2',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      {/* <Tab.Screen name="Counter" component={CounterScreen} /> */}

      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: 'Users',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Account',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
