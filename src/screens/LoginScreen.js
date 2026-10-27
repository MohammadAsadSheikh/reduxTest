import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginSuccess, logout } from '../features/auth/authSlice';
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '../features/auth/authSelectors';

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogin = () => {
    dispatch(
      loginSuccess({
        id: '1',
        name: 'Demo User',
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Authentication Demo</Text>

        {isAuthenticated ? (
          <>
            <Text style={styles.message}>Welcome, {user.name}!</Text>

            <Button title="Logout" onPress={handleLogout} />
          </>
        ) : (
          <>
            <Text style={styles.message}>You are not logged in.</Text>

            <Button title="Demo Login" onPress={handleLogin} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});
