import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  loadPreferences,
  savePreferences,
} from '../features/preferences/preferencesStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomSwitch from '../components/CustomSwitch';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

function PreferenceRow({
  title,
  description,
  value,
  onValueChange,
  preferencesLoaded,
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceInfo}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>

      <CustomSwitch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={title}
        disabled={!preferencesLoaded}
      />
    </View>
  );
}

export default function PreferencesScreen() {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [compactListEnabled, setCompactListEnabled] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function getPreferences() {
        try {
          const preferences = await loadPreferences();

          if (isActive) {
            setNotificationsEnabled(preferences.notificationsEnabled);
            setCompactListEnabled(preferences.compactListEnabled);
          }
        } catch (error) {
          console.error('Failed to load preferences:', error);
        } finally {
          if (isActive) {
            setPreferencesLoaded(true);
          }
        }
      }

      setPreferencesLoaded(false);
      getPreferences();

      return () => {
        isActive = false;
      };
    }, []),
  );

  async function updatePreference(key, value) {
    const updatedPreferences = {
      notificationsEnabled,
      compactListEnabled,
      [key]: value,
    };

    if (key === 'notificationsEnabled') {
      setNotificationsEnabled(value);
    } else if (key === 'compactListEnabled') {
      setCompactListEnabled(value);
    }

    try {
      await savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

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

        <Text style={styles.eyebrow}>PERSONALIZATION</Text>
        <Text style={styles.title}>App preferences</Text>
        <Text style={styles.subtitle}>
          Choose how you want Teamspace to behave.
        </Text>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <PreferenceRow
            title="Notifications"
            description="Enable in-app notification preferences."
            value={notificationsEnabled}
            onValueChange={value =>
              updatePreference('notificationsEnabled', value)
            }
            preferencesLoaded={preferencesLoaded}
          />
        </View>

        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <PreferenceRow
            title="Compact user list"
            description="Preference for a denser user directory."
            value={compactListEnabled}
            onValueChange={value =>
              updatePreference('compactListEnabled', value)
            }
            preferencesLoaded={preferencesLoaded}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About preferences</Text>
          <Text style={styles.infoText}>
            Your preferences are saved on this device. Compact user list changes
            the Users screen layout. Notifications is a preference toggle and
            does not yet enable device notifications.
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
    fontSize: 29,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xxl,
  },

  preferenceRow: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },

  preferenceInfo: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  preferenceTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  preferenceDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 17,
    padding: spacing.lg,
  },
  infoTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  infoText: {
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
});
