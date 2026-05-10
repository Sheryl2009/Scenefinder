import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import { useUserPreferences } from '../hooks';

interface ProfileScreenProps {
  onClearCache: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onClearCache,
}) => {
  const {
    preferences,
    updatePreferences,
    clearCache,
    getCacheSize,
  } = useUserPreferences();

  const handleToggleNotifications = (value: boolean) => {
    updatePreferences({ notificationsEnabled: value });
  };

  const handleToggleCache = (value: boolean) => {
    updatePreferences({ cacheEnabled: value });
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will delete all cached data including your search history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearCache();
            await getCacheSize();
            onClearCache();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sign In</Text>
              <Text style={styles.settingDescription}>
                Sign in to sync your history across devices
              </Text>
            </View>
            <Text style={styles.signInButton}>Sign In</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates about new features
              </Text>
            </View>
            <Switch
              value={preferences.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: COLORS.surface, true: COLORS.cinemaRed }}
              thumbColor={COLORS.primaryText}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Local Cache</Text>
              <Text style={styles.settingDescription}>
                Cache images for faster loading
              </Text>
            </View>
            <Switch
              value={preferences.cacheEnabled}
              onValueChange={handleToggleCache}
              trackColor={{ false: COLORS.surface, true: COLORS.cinemaRed }}
              thumbColor={COLORS.primaryText}
            />
          </View>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleClearCache}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingDescription}>
                Free up storage space
              </Text>
            </View>
            <Text style={styles.cacheSize}>
              ~{Math.round(preferences.cacheSize / 1024)}KB
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingTitle}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingTitle}>Open Source Licenses</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    marginBottom: 2,
  },
  settingDescription: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  settingValue: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  signInButton: {
    color: COLORS.cinemaRed,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  cacheSize: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  chevron: {
    color: COLORS.mutedText,
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginLeft: SPACING.md,
  },
});

export default ProfileScreen;
