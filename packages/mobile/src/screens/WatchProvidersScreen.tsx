import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';
import type { StreamingProvider } from '../types';
import { ProviderCard } from '../components';
import { openExternalUrl } from '../services/media';

interface WatchProvidersScreenProps {
  providers: StreamingProvider[];
  onBack: () => void;
}

// Mock data for demonstration
const MOCK_PROVIDERS: StreamingProvider[] = [
  {
    id: 1,
    name: 'Netflix',
    logo_path: 'https://via.placeholder.com/40x40/000000/FFFFFF?text=N',
    price: 15.99,
    type: 'subscription',
  },
  {
    id: 2,
    name: 'Amazon Prime',
    logo_path: 'https://via.placeholder.com/40x40/000000/FFFFFF?text=AP',
    price: 12.99,
    type: 'subscription',
  },
  {
    id: 3,
    name: 'Apple TV+',
    logo_path: 'https://via.placeholder.com/40x40/000000/FFFFFF?text=ATV',
    price: 9.99,
    type: 'subscription',
  },
];

export const WatchProvidersScreen: React.FC<WatchProvidersScreenProps> = ({
  providers = MOCK_PROVIDERS,
  onBack,
}) => {
  const handleProviderPress = (provider: StreamingProvider) => {
    // In production, this would open the actual streaming app or website
    console.log(`Opening ${provider.name}...`);
  };

  const subscriptionProviders = providers.filter((p) => p.type === 'subscription');
  const rentProviders = providers.filter((p) => p.type === 'rent' || p.type === 'buy');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Where to Watch</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        {subscriptionProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stream</Text>
            {subscriptionProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onPress={() => handleProviderPress(provider)}
              />
            ))}
          </View>
        )}

        {/* Rent/Buy Section */}
        {rentProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rent or Buy</Text>
            {rentProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onPress={() => handleProviderPress(provider)}
              />
            ))}
          </View>
        )}

        {/* No Providers Message */}
        {providers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📺</Text>
            <Text style={styles.emptyTitle}>No Streaming Options</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any streaming providers for this content.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.primaryText,
    fontSize: 24,
  },
  headerTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.cardTitle.fontSize,
    fontWeight: TYPOGRAPHY.cardTitle.fontWeight,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.body.fontSize,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

export default WatchProvidersScreen;
