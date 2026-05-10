import React from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';

interface ProcessingScreenProps {
  imageUri: string;
  progress: number;
  stage: 'uploading' | 'analyzing' | 'matching';
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  imageUri,
  progress,
  stage,
}) => {
  const scanLinePosition = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scanLinePosition, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'uploading':
        return 'Uploading image...';
      case 'analyzing':
        return 'Analyzing scene...';
      case 'matching':
        return 'Finding match...';
      default:
        return 'Processing...';
    }
  };

  const getSubText = () => {
    switch (stage) {
      case 'uploading':
        return 'Sending your screenshot to our servers';
      case 'analyzing':
        return 'Comparing against millions of frames';
      case 'matching':
        return 'Matching with our database';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
          resizeMode="cover"
          blurRadius={5}
        />
        <Animated.View
          style={[
            styles.scanLine,
            {
              top: scanLinePosition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
            },
          ]}
        />
      </View>

      {/* Progress Info */}
      <View style={styles.progressContainer}>
        <Text style={styles.stageText}>{getStageText()}</Text>
        <Text style={styles.subText}>{getSubText()}</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.cinemaRed,
    shadowColor: COLORS.cinemaRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stageText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
    marginBottom: SPACING.sm,
  },
  subText: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: SPACING.lg,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.cinemaRed,
  },
  progressText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.sm,
  },
});

export default ProcessingScreen;
