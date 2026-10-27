import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@teamspace/preferences';

const DEFAULT_PREFERENCES = {
  notificationsEnabled: true,
  compactListEnabled: false,
};

export async function loadPreferences() {
  try {
    const storedPreferences = await AsyncStorage.getItem(PREFERENCES_KEY);

    if (!storedPreferences) {
      return DEFAULT_PREFERENCES;
    }

    const parsedPreferences = JSON.parse(storedPreferences);

    return {
      ...DEFAULT_PREFERENCES,
      ...parsedPreferences,
    };
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(preferences) {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save preferences:', error);
    throw error;
  }
}
