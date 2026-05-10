import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import type { StreamingProvider } from '../types';

interface ProviderCardProps {
  provider: StreamingProvider;
  onPress: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.logoContainer}>
        {provider.logo_path ? (
          <Image
            source={{ uri: provider.logo_path }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>▶</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.type}>
          {provider.type === 'subscription'
            ? 'Subscription'
            : provider.type === 'rent'
            ? 'Rent'
            : 'Buy'}
          {provider.price && ` • $${provider.price}`}
        </Text>
      </View>
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaText}>Watch</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderLogo: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  type: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  ctaContainer: {
    backgroundColor: COLORS.cinemaRed,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
  },
  ctaText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
});
