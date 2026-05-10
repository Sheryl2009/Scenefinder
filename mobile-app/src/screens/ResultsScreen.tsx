import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Share,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import type { SceneMatch } from '../types';
import { Button } from '../components';

interface ResultsScreenProps {
  match: SceneMatch;
  onViewDetails: () => void;
  onWatchProviders: () => void;
  onTryAgain: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  match,
  onViewDetails,
  onWatchProviders,
  onTryAgain,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I found "${match.movie_title}" using SceneFinder! ${match.timestamp ? `Scene at ${match.timestamp}` : ''}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Match Card */}
      <View style={styles.matchCard}>
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
          {match.confidence >= 0.7 && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(match.confidence * 100)}% Match
              </Text>
            </View>
          )}
        </View>

        <View style={styles.movieInfo}>
          <Text style={styles.title}>{match.movie_title}</Text>
          {match.timestamp && (
            <Text style={styles.timestamp}>Scene at {match.timestamp}</Text>
          )}
          {match.scene_description && (
            <Text style={styles.description}>{match.scene_description}</Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="View Details"
          onPress={onViewDetails}
          variant="primary"
          style={styles.primaryButton}
        />
        <Button
          title="Share Result"
          onPress={handleShare}
          variant="secondary"
          style={styles.secondaryButton}
        />
        <Button
          title="Try Again"
          onPress={onTryAgain}
          variant="tertiary"
        />
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
    padding: SPACING.md,
  },
  matchCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: 250,
  },
  placeholderPoster: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
  },
  confidenceBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
  },
  confidenceText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  movieInfo: {
    padding: SPACING.md,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
    marginBottom: SPACING.sm,
  },
  timestamp: {
    color: COLORS.gold,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: 24,
  },
  actions: {
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    marginBottom: SPACING.md,
  },
});

export default ResultsScreen;
