import React from 'react';
import {
  Linking,
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
import { selectUserById } from '../features/users/usersSelectors';
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

function InfoRow({ label, value, last = false, onPress }) {
  if (!value) {
    return null;
  }

  const content = (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text selectable style={[styles.infoValue, onPress && styles.linkValue]}>
        {value}
      </Text>
      {onPress && <Text style={styles.linkArrow}>↗</Text>}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}

function InfoSection({ title, subtitle, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.infoCard}>{children}</View>
    </View>
  );
}

export default function UserDetailsScreen({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const user = useAppSelector(state => selectUserById(state, userId));

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.notFound}>
          <View style={styles.notFoundIcon}>
            <Text style={styles.notFoundIconText}>?</Text>
          </View>
          <Text style={styles.notFoundTitle}>User not found</Text>
          <Text style={styles.notFoundDescription}>
            This profile may no longer be available. Return to the directory and
            select another user.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = user.name || 'Unknown user';
  const company = user.company?.name;
  const address = user.address;

  const avatarIndex = Math.abs(Number(user.id) || 0) % AVATAR_COLORS.length;

  const website = user.website
    ? `https://${user.website.replace(/^https?:\/\//, '')}`
    : null;

  const openLink = url => {
    Linking.openURL(url).catch(() => {
      // Keep the screen usable if the URL cannot be opened.
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to users"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backButtonText}>Back to users</Text>
        </Pressable>
        <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>
          View team member information and contact details.
        </Text>

        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: AVATAR_COLORS[avatarIndex] },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
          </View>

          <Text style={styles.name}>{fullName}</Text>

          {user.username ? (
            <Text style={styles.username}>@{user.username}</Text>
          ) : null}

          {user.email ? (
            <Text style={styles.profileEmail}>{user.email}</Text>
          ) : null}

          <View style={styles.profileBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.profileBadgeText}>Team member</Text>
          </View>

          {company ? (
            <View style={styles.companyPill}>
              <Text style={styles.companyPillText}>{company}</Text>
            </View>
          ) : null}
        </View>

        <InfoSection title="Contact information" subtitle="Get in touch">
          <InfoRow
            label="Email address"
            value={user.email}
            onPress={
              user.email ? () => openLink(`mailto:${user.email}`) : undefined
            }
          />

          <InfoRow
            label="Phone number"
            value={user.phone}
            onPress={
              user.phone
                ? () => openLink(`tel:${user.phone.replace(/[^+\d]/g, '')}`)
                : undefined
            }
          />

          <InfoRow
            label="Website"
            value={user.website}
            last
            onPress={website ? () => openLink(website) : undefined}
          />
        </InfoSection>

        <InfoSection title="Company" subtitle="Organization details">
          <InfoRow label="Company name" value={company} />

          <InfoRow label="Catchphrase" value={user.company?.catchPhrase} />

          <InfoRow label="Business" value={user.company?.bs} last />
        </InfoSection>

        <InfoSection title="Address" subtitle="Location details">
          <InfoRow
            label="Street address"
            value={[address?.street, address?.suite].filter(Boolean).join(', ')}
          />

          <InfoRow label="City" value={address?.city} />

          <InfoRow label="Postal code" value={address?.zipcode} />

          <InfoRow
            label="Coordinates"
            value={
              address?.geo?.lat && address?.geo?.lng
                ? `${address.geo.lat}, ${address.geo.lng}`
                : null
            }
            last
          />
        </InfoSection>

        <Text style={styles.footer}>Teamspace · People, organized.</Text>
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
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 29,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  username: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  profileEmail: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.lg,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  profileBadgeText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  companyPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    maxWidth: '100%',
  },
  companyPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    paddingHorizontal: spacing.lg,
  },
  infoRow: {
    paddingVertical: spacing.lg,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    flexShrink: 1,
  },
  linkValue: {
    color: colors.primary,
    paddingRight: spacing.xl,
  },
  linkArrow: {
    position: 'absolute',
    right: 0,
    bottom: spacing.lg,
    color: colors.primary,
    fontSize: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  notFoundIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundIconText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.lg,
  },
  notFoundDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },

  backArrow: {
    color: colors.primary,
    fontSize: 32,
    lineHeight: 34,
    marginRight: spacing.sm,
  },

  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
