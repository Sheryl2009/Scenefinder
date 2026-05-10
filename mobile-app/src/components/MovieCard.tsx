import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import type { SceneMatch } from '../types';

interface MovieCardProps {
  match: SceneMatch;
  onPress: () => void;
  showConfidence?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  match,
  onPress,
  showConfidence = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.posterContainer}>
        {match.poster_url ? (
          <Image
            source={{ uri: match.poster_url }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderPoster}>
            <Text style={styles.placeholderText}>🎬</Text>
          </View>
        )}
        {showConfidence && match.confidence >= 0.7 && (
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {Math.round(match.confidence * 100)}% match
            </Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {match.movie_title}
        </Text>
        {match.timestamp && (
          <Text style={styles.timestamp}>
            Scene at {match.timestamp}
          </Text>
        )}
        {match.scene_description && (
          <Text style={styles.description} numberOfLines={2}>
            {match.scene_description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: 200,
  },
  placeholderPoster: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  confidenceBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  confidenceText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.micro.fontSize,
    fontWeight: '600',
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.cardTitle.fontSize,
    fontWeight: TYPOGRAPHY.cardTitle.fontWeight,
    marginBottom: SPACING.xs,
  },
  timestamp: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 20,
  },
});
