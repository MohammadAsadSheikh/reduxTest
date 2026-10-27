import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { filterUsers, sortUsers } from '../features/users/usersUtils';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/usersSlice';
import {
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from '../features/users/usersSelectors';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { loadPreferences } from '../features/preferences/preferencesStorage';
import { useFocusEffect } from '@react-navigation/native';

const AVATAR_COLORS = [
  colors.avatarBlue,
  colors.avatarGreen,
  colors.avatarPurple,
  colors.avatarOrange,
];

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

function UserCard({ user, index, onPress, compact }) {
  const companyName = user.company?.name || 'No company listed';
  const email = user.email || 'No email available';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${user.name}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.userCard,
        compact && styles.userCardCompact,
        pressed && styles.userCardPressed,
      ]}
    >
      <View
        style={[
          styles.avatar,
          compact && styles.avatarCompact,
          {
            backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
          },
        ]}
      >
        <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>

        <Text style={styles.userEmail} numberOfLines={1}>
          {email}
        </Text>

        <View style={styles.companyRow}>
          <View style={styles.companyDot} />
          <Text style={styles.companyName} numberOfLines={1}>
            {companyName}
          </Text>
        </View>
      </View>

      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ query, onClear }) {
  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.stateCard}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>{hasQuery ? '⌕' : '♙'}</Text>
      </View>

      <Text style={styles.stateTitle}>
        {hasQuery ? 'No matching users' : 'No users available'}
      </Text>

      <Text style={styles.stateDescription}>
        {hasQuery
          ? 'Try another name, email address, or company.'
          : 'Users will appear here when data is available.'}
      </Text>

      {hasQuery && (
        <Pressable
          accessibilityRole="button"
          onPress={onClear}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Clear search</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function UsersScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState('name-asc');
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  const [searchQuery, setSearchQuery] = useState('');

  const [compactListEnabled, setCompactListEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function getPreferences() {
        const preferences = await loadPreferences();

        if (isActive) {
          setCompactListEnabled(preferences.compactListEnabled);
        }
      }

      getPreferences();

      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const filteredUsers = useMemo(() => {
    const filtered = filterUsers(users, searchQuery);
    return sortUsers(filtered, sortOrder);
  }, [users, searchQuery, sortOrder]);

  const handleRetry = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpenUser = useCallback(
    userId => {
      navigation.navigate('UserDetails', { userId });
    },
    [navigation],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const isLoading = status === 'loading';
  const hasError = status === 'failed' || status === 'rejected';
  const hasUsers = users.length > 0;

  const renderUser = useCallback(
    ({ item, index }) => (
      <UserCard
        user={item}
        index={index}
        onPress={() => handleOpenUser(item.id)}
        compact={compactListEnabled}
      />
    ),
    [handleOpenUser, compactListEnabled],
  );

  const keyExtractor = useCallback(item => String(item.id), []);

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>All users</Text>
        <Text style={styles.resultCount}>
          {filteredUsers.length}{' '}
          {filteredUsers.length === 1 ? 'person' : 'people'}
        </Text>
      </View>
    ),
    [filteredUsers.length],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
          <Text style={styles.title}>People</Text>
          <Text style={styles.subtitle}>
            Discover and manage your team members.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            accessibilityLabel="Search users"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search name, email, company..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />

          {searchQuery.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.toolbarLabel}>SORT BY</Text>

          <View style={styles.sortOptions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sort users by name A to Z"
              accessibilityState={{ selected: sortOrder === 'name-asc' }}
              onPress={() => setSortOrder('name-asc')}
              style={[
                styles.sortButton,
                sortOrder === 'name-asc' && styles.sortButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortOrder === 'name-asc' && styles.sortButtonTextActive,
                ]}
              >
                Name A–Z
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sort users by name Z to A"
              accessibilityState={{ selected: sortOrder === 'name-desc' }}
              onPress={() => setSortOrder('name-desc')}
              style={[
                styles.sortButton,
                sortOrder === 'name-desc' && styles.sortButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortOrder === 'name-desc' && styles.sortButtonTextActive,
                ]}
              >
                Name Z–A
              </Text>
            </Pressable>
          </View>
        </View>

        {isLoading && !hasUsers ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateTitle}>Finding your people</Text>
            <Text style={styles.stateDescription}>
              Loading the user directory...
            </Text>
          </View>
        ) : hasError && !hasUsers ? (
          <View style={styles.stateCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>

            <Text style={styles.stateTitle}>Couldn't load users</Text>

            <Text style={styles.stateDescription}>
              {error || 'Something went wrong. Please try again.'}
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleRetry}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {isLoading && hasUsers && (
              <View style={styles.refreshingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.refreshingText}>Updating directory...</Text>
              </View>
            )}

            {hasError && hasUsers && (
              <Pressable
                accessibilityRole="button"
                onPress={handleRetry}
                style={styles.inlineError}
              >
                <Text style={styles.inlineErrorText}>
                  Couldn't refresh users. Tap to retry.
                </Text>
              </Pressable>
            )}

            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
              keyExtractor={keyExtractor}
              ListHeaderComponent={listHeader}
              ListEmptyComponent={
                <EmptyState query={searchQuery} onClear={handleClearSearch} />
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={10}
              windowSize={7}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  searchContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    color: colors.textSecondary,
    fontSize: 25,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: spacing.md,
  },
  clearButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 25,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  resultCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 94,
  },
  userCardPressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  companyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  companyName: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 11,
  },
  chevronContainer: {
    marginLeft: spacing.sm,
    paddingLeft: spacing.xs,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 27,
  },
  stateCard: {
    flex: 1,
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  stateDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  emptyIconText: {
    color: colors.primary,
    fontSize: 32,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconText: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 13,
    marginTop: spacing.lg,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  refreshingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  refreshingText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  inlineError: {
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.dangerLight,
    marginBottom: spacing.md,
  },
  inlineErrorText: {
    color: colors.danger,
    fontSize: 12,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  toolbarLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  sortOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  sortButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  sortButtonText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },

  sortButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  userCardCompact: {
    minHeight: 68,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },

  avatarCompact: {
    width: 40,
    height: 40,
    borderRadius: 13,
  },
});
