import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function UserDetailsScreen({ route }) {
  const { userId } = route.params;

  const user = useSelector(state =>
    state.users.data.find(item => item.id === userId),
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>User not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user.phone}</Text>

          <Text style={styles.label}>Website</Text>
          <Text style={styles.value}>{user.website}</Text>

          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>{user.company.name}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>
            {user.address.street}, {user.address.city}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  username: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#0F172A',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
