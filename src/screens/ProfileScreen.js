import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAppSelector } from '../app/hooks';
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '../features/auth/authSelectors';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text selectable style={styles.infoValue}>
        {value || 'Not available'}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const name = user?.name || 'Guest user';
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to Account"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back to account</Text>
        </Pressable>

        <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
        <Text style={styles.title}>My profile</Text>
        <Text style={styles.subtitle}>
          Your account information at a glance.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'G'}</Text>
          </View>

          <Text style={styles.name}>{name}</Text>

          <View
            style={[
              styles.statusBadge,
              !isAuthenticated && styles.guestStatusBadge,
            ]}
          >
            <View
              style={[styles.statusDot, !isAuthenticated && styles.guestDot]}
            />

            <Text
              style={[
                styles.statusText,
                !isAuthenticated && styles.guestStatusText,
              ]}
            >
              {isAuthenticated ? 'Signed in' : 'Guest account'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account details</Text>

        <View style={styles.detailsCard}>
          <InfoRow label="Full name" value={user?.name} />
          <View style={styles.divider} />
          <InfoRow label="User ID" value={user?.id} />
          <View style={styles.divider} />
          <InfoRow
            label="Authentication"
            value={isAuthenticated ? 'Demo sign-in' : 'Not signed in'}
          />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>About this account</Text>
          <Text style={styles.noteText}>
            This app currently uses local demo authentication. Profile details
            are stored in Redux and are not verified against a backend service.
          </Text>
        </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backArrow: {
    color: colors.primary,
    fontSize: 32,
    marginRight: spacing.sm,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 23,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: colors.avatarBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 27,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  guestDot: {
    backgroundColor: colors.textMuted,
  },
  statusText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    paddingHorizontal: spacing.lg,
  },
  infoRow: {
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  noteCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 17,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  noteTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  noteText: {
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  guestStatusBadge: {
    backgroundColor: colors.border,
  },

  guestStatusText: {
    color: colors.textSecondary,
  },
});
