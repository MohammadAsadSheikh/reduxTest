import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginSuccess, logout } from '../features/auth/authSlice';
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '../features/auth/authSelectors';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useNavigation } from '@react-navigation/native';

function SettingsRow({ symbol, title, subtitle, onPress, danger = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsRow,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.rowIcon, danger && styles.dangerIcon]}>
        <Text style={[styles.rowIconText, danger && styles.dangerText]}>
          {symbol}
        </Text>
      </View>

      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>

      <Text style={[styles.rowChevron, danger && styles.dangerText]}>›</Text>
    </Pressable>
  );
}

export default function AccountScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const displayName = user?.name || 'Guest user';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

  const handleDemoLogin = () => {
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
        <Text style={styles.pageTitle}>Account</Text>
        <Text style={styles.pageSubtitle}>
          Manage your profile and preferences.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || 'G'}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={2}>
                {displayName}
              </Text>
              <Text style={styles.profileDescription}>
                {isAuthenticated
                  ? 'Your Teamspace account'
                  : 'You are browsing as a guest'}
              </Text>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.accountStatusRow}>
            <View
              style={[
                styles.statusDot,
                !isAuthenticated && styles.guestStatusDot,
              ]}
            />
            <Text style={styles.accountStatus}>
              {isAuthenticated ? 'Signed in' : 'Not signed in'}
            </Text>

            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO APP</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsCard}>
          <SettingsRow
            symbol="◉"
            title="Profile"
            subtitle="Your account information"
            onPress={() => navigation.navigate('Profile')}
          />

          <SettingsRow
            symbol="⌘"
            title="App preferences"
            subtitle="Personalize your experience"
            onPress={() => navigation.navigate('Preferences')}
          />

          <SettingsRow
            symbol="♧"
            title="Privacy & security"
            subtitle="Account and security options"
            onPress={() => {}}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
        </View>

        <View style={styles.settingsCard}>
          <SettingsRow
            symbol="✳"
            title="Teamspace"
            subtitle="React Native portfolio project"
            onPress={() => {}}
          />

          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>App version</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
        </View>

        {isAuthenticated ? (
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.logoutButtonText}>Sign out</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={handleDemoLogin}
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.signInButtonText}>Try demo sign-in</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          Made with React Native and Redux Toolkit.
        </Text>
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
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  pageSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 23,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: colors.avatarBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  profileDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  accountStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  guestStatusDot: {
    backgroundColor: colors.textMuted,
  },
  accountStatus: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  demoBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  demoBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
  },
  settingsRow: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowIconText: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '700',
  },
  rowContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
  rowChevron: {
    color: colors.textMuted,
    fontSize: 25,
  },
  dangerIcon: {
    backgroundColor: colors.dangerLight,
  },
  dangerText: {
    color: colors.danger,
  },
  versionRow: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  versionValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  signInButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  signInButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
