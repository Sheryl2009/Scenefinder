import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import type { Movie, StreamingProvider } from '../types';
import { apiService } from '../services/api';
import { Button, LoadingSpinner } from '../components';

interface MovieDetailsScreenProps {
  movieId: number;
  onBack: () => void;
  onWatchProviders: () => void;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({
  movieId,
  onBack,
  onWatchProviders,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await apiService.getMovieDetails(movieId);
      setMovie(details);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Loading movie details..." />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
        <Button title="Go Back" onPress={onBack} variant="secondary" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Backdrop */}
      <View style={styles.heroContainer}>
        {movie.backdrop_path ? (
          <Image
            source={{ uri: movie.backdrop_path }}
            style={styles.backdrop}
            resizeMode="cover"
            blurRadius={10}
          />
        ) : null}
        <View style={styles.heroOverlay} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Poster + Info */}
        <View style={styles.posterInfoRow}>
          {movie.poster_path ? (
            <Image
              source={{ uri: movie.poster_path }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.poster, styles.placeholderPoster]}>
              <Text style={styles.placeholderText}>🎬</Text>
            </View>
          )}
          <View style={styles.basicInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.metadata}>
              {movie.release_date?.split('-')[0]}
              {movie.runtime && ` • ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <View style={styles.genresContainer}>
          {movie.genres.map((genre) => (
            <View key={genre.id} style={styles.genrePill}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      {/* Streaming Providers */}
      {movie.streaming_providers && movie.streaming_providers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where to Watch</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providersList}
          >
            {movie.streaming_providers.map((provider) => (
              <View key={provider.id} style={styles.providerChip}>
                <Text style={styles.providerName}>{provider.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title="Find Streaming Options"
          onPress={onWatchProviders}
          variant="primary"
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
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.body.fontSize,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  heroContainer: {
    height: 350,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xl + 20,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: COLORS.primaryText,
    fontSize: 24,
  },
  posterInfoRow: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: BORDER_RADIUS.card,
  },
  placeholderPoster: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  basicInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.sm,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
    marginBottom: SPACING.xs,
  },
  metadata: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  genrePill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  genreText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.cardTitle.fontSize,
    fontWeight: TYPOGRAPHY.cardTitle.fontWeight,
    marginBottom: SPACING.sm,
  },
  overview: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: 24,
  },
  providersList: {
    paddingRight: SPACING.md,
  },
  providerChip: {
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    marginRight: SPACING.sm,
  },
  providerName: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  ctaContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
});

export default MovieDetailsScreen;
