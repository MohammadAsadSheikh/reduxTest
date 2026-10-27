import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/usersSlice';
import {
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from '../features/users/usersSelectors';
export default function UsersScreen({ navigation }) {
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const renderUser = ({ item }) => (
    <Pressable
      style={styles.userCard}
      onPress={() =>
        navigation.navigate('UserDetails', {
          userId: item.id,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.company}>{item.company.name}</Text>
      <Text style={styles.viewDetails}>View details →</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Users</Text>

      {status === 'loading' && <ActivityIndicator size="large" />}

      {status === 'failed' && (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Try Again" onPress={() => dispatch(fetchUsers())} />
        </View>
      )}

      {status === 'succeeded' && (
        <FlatList
          data={data}
          renderItem={renderUser}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  email: {
    marginTop: 5,
    color: '#475569',
  },
  company: {
    marginTop: 5,
    color: '#64748B',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
  },
  viewDetails: {
    marginTop: 10,
    color: '#2563EB',
    fontWeight: '600',
  },
});
