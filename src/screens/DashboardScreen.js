import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/usersSlice';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

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

function MetricCard({ label, value, description, accent }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accent }]} />

      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDescription}>{description}</Text>
    </View>
  );
}

function DashboardScreen({ navigation }) {
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.users.data);
  const status = useAppSelector(state => state.users.status);
  const error = useAppSelector(state => state.users.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const metrics = useMemo(() => {
    const companies = new Set(
      users.map(user => user.company?.name).filter(Boolean),
    );

    const cities = new Set(
      users.map(user => user.address?.city).filter(Boolean),
    );

    return {
      totalUsers: users.length,
      companies: companies.size,
      cities: cities.size,
    };
  }, [users]);

  const isLoading = status === 'loading';
  const hasError = status === 'failed' || status === 'rejected';

  const recentUsers = users.slice(0, 4);

  const handleRetry = () => {
    dispatch(fetchUsers());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
            <Text style={styles.heading}>Dashboard</Text>
            <Text style={styles.subtitle}>Manage your team in one place.</Text>
          </View>

          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>U</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open user directory"
          onPress={() => navigation.navigate('Users')}
          style={styles.searchContainer}
        >
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search people, teams...</Text>
          <Text style={styles.searchShortcut}>→</Text>
        </Pressable>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroEyebrow}>TEAM OVERVIEW</Text>
              <Text style={styles.heroTitle}>People first.</Text>
              <Text style={styles.heroSubtitle}>
                Everything about your team, at a glance.
              </Text>
            </View>

            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>✳</Text>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.heroMetricLabel}>TOTAL USERS</Text>
              <Text style={styles.heroMetricValue}>
                {isLoading && users.length === 0 ? '—' : metrics.totalUsers}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('Users')}
              style={styles.heroButton}
            >
              <Text style={styles.heroButtonText}>View directory →</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>At a glance</Text>
          <Text style={styles.sectionCaption}>From your user data</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="COMPANIES"
            value={isLoading && users.length === 0 ? '—' : metrics.companies}
            description="Unique organizations"
            accent={colors.primary}
          />

          <MetricCard
            label="CITIES"
            value={isLoading && users.length === 0 ? '—' : metrics.cities}
            description="Locations represented"
            accent={colors.success}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent users</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Users')}
            hitSlop={8}
          >
            <Text style={styles.viewAll}>View all →</Text>
          </Pressable>
        </View>

        {isLoading && users.length === 0 ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.stateTitle}>Loading your team</Text>
            <Text style={styles.stateDescription}>
              Fetching the latest user information.
            </Text>
          </View>
        ) : hasError && users.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Couldn't load users</Text>
            <Text style={styles.stateDescription}>
              {error || 'Something went wrong. Please try again.'}
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleRetry}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No users yet</Text>
            <Text style={styles.stateDescription}>
              User information will appear here when available.
            </Text>
          </View>
        ) : (
          <View style={styles.userList}>
            {recentUsers.map((user, index) => (
              <Pressable
                key={user.id}
                accessibilityRole="button"
                accessibilityLabel={`View ${user.name}`}
                onPress={() =>
                  navigation.navigate('UserDetails', {
                    userId: user.id,
                  })
                }
                style={({ pressed }) => [
                  styles.userRow,
                  pressed && styles.userRowPressed,
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor:
                        AVATAR_COLORS[index % AVATAR_COLORS.length],
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {getInitials(user.name)}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.userCompany} numberOfLines={1}>
                    {user.company?.name || user.email}
                  </Text>
                </View>

                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.footer}>Teamspace · Your people, organized.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  heading: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  brandMarkText: {
    color: colors.surface,
    fontSize: 23,
    fontWeight: '800',
  },
  searchContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    marginBottom: spacing.xl,
  },
  searchIcon: {
    color: colors.textSecondary,
    fontSize: 25,
    marginRight: spacing.md,
  },
  searchPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
  },
  searchShortcut: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 25,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroEyebrow: {
    color: '#C5D6FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: '800',
    marginTop: spacing.sm,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: '#D1DCF4',
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
    maxWidth: 230,
  },
  heroIcon: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#40568A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  heroIconText: {
    color: '#FFFFFF',
    fontSize: 27,
  },
  heroDivider: {
    height: 1,
    backgroundColor: '#465987',
    marginVertical: spacing.xl,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroMetricLabel: {
    color: '#C5D6FF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  heroMetricValue: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  heroButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 13,
  },
  heroButtonText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
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
  sectionCaption: {
    color: colors.textMuted,
    fontSize: 11,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  metricAccent: {
    width: 27,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  metricValue: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  metricDescription: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  userList: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
  },
  userRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  userRowPressed: {
    opacity: 0.65,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  userName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  userCompany: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 26,
    paddingHorizontal: spacing.xs,
  },
  stateCard: {
    minHeight: 165,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.xl,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  stateDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

export default DashboardScreen;
