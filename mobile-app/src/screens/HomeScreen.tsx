import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import { pickImage } from '../services/media';
import type { ImageSource, SearchHistoryItem } from '../services/media';
import type { SceneMatch } from '../types';
import { Button } from '../components';

interface HomeScreenProps {
  recentSearches: SearchHistoryItem[];
  onImageSelected: (uri: string) => void;
  onRecentSearchPress: (item: SearchHistoryItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentSearches,
  onImageSelected,
  onRecentSearchPress,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleUploadPress = useCallback(async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const uri = await pickImage('camera');
            if (uri) {
              onImageSelected(uri);
            }
          } else if (buttonIndex === 2) {
            const uri = await pickImage('gallery');
            if (uri) {
              onImageSelected(uri);
            }
          }
        }
      );
    } else {
      // Android - simple modal could be used, here we default to gallery
      const uri = await pickImage('gallery');
      if (uri) {
        onImageSelected(uri);
      }
    }
  }, [onImageSelected]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>SceneFinder</Text>
          <Text style={styles.tagline}>Identify any movie scene instantly</Text>
        </View>

        {/* Upload CTA */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadPress}
          activeOpacity={0.9}
        >
          <View style={styles.uploadButtonInner}>
            <Text style={styles.uploadIcon}>📷</Text>
          </View>
          <Text style={styles.uploadHint}>Tap to upload a screenshot</Text>
        </TouchableOpacity>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {recentSearches.slice(0, 10).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentItem}
                  onPress={() => onRecentSearchPress(item)}
                >
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.recentImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.recentPlaceholder}>
                      <Text style={styles.recentPlaceholderText}>🎬</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📸</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Capture a Screenshot</Text>
              <Text style={styles.featureDescription}>
                Take a screenshot of any movie or TV show scene
              </Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔍</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>AI Analysis</Text>
              <Text style={styles.featureDescription}>
                Our AI compares against millions of frames
              </Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎬</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Get Instant Results</Text>
              <Text style={styles.featureDescription}>
                See the movie, scene details, and where to watch
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.heroTitle.fontSize,
    fontWeight: TYPOGRAPHY.heroTitle.fontWeight,
    marginBottom: SPACING.sm,
  },
  tagline: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  uploadButton: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  uploadButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.cinemaRed,
  },
  uploadIcon: {
    fontSize: 40,
  },
  uploadHint: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.md,
  },
  recentSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.cardTitle.fontSize,
    fontWeight: TYPOGRAPHY.cardTitle.fontWeight,
    marginBottom: SPACING.md,
  },
  recentList: {
    paddingRight: SPACING.md,
  },
  recentItem: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPlaceholderText: {
    fontSize: 24,
  },
  featuresSection: {
    marginBottom: SPACING.xl,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
});

export default HomeScreen;
