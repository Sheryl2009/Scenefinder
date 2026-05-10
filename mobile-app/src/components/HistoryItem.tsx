import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/design';
import type { SearchHistoryItem } from '../types';

interface HistoryItemProps {
  item: SearchHistoryItem;
  onPress: () => void;
  onDelete: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onPress,
  onDelete,
}) => {
  const formattedDate = new Date(item.searchedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnail}>
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Text style={styles.placeholderText}>🎬</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.movieTitle}
        </Text>
        <Text style={styles.subtitle}>
          {Math.round(item.confidence * 100)}% match • {item.timestamp}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
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
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: 2,
  },
  date: {
    color: COLORS.mutedText,
    fontSize: TYPOGRAPHY.micro.fontSize,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteText: {
    color: COLORS.mutedText,
    fontSize: 16,
  },
});
