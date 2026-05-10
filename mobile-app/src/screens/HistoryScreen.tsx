import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';
import type { SearchHistoryItem } from '../types';
import { HistoryItem, EmptyState } from '../components';

interface HistoryScreenProps {
  history: SearchHistoryItem[];
  onItemPress: (item: SearchHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  isLoading: boolean;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onItemPress,
  onDeleteItem,
  onClearAll,
  isLoading,
}) => {
  const handleDeleteItem = useCallback(
    (item: SearchHistoryItem) => {
      Alert.alert(
        'Delete Search',
        `Delete "${item.movieTitle}" from history?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDeleteItem(item.id),
          },
        ]
      );
    },
    [onDeleteItem]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: onClearAll,
        },
      ]
    );
  }, [onClearAll]);

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="🔍"
          title="No Searches Yet"
          description="Your scene identification history will appear here"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search History</Text>
        <Text style={styles.clearButton} onPress={handleClearAll}>
          Clear All
        </Text>
      </View>

      {/* History List */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() => onItemPress(item)}
            onDelete={() => handleDeleteItem(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.screenTitle.fontSize,
    fontWeight: TYPOGRAPHY.screenTitle.fontWeight,
  },
  clearButton: {
    color: COLORS.cinemaRed,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  listContent: {
    padding: SPACING.md,
  },
});

export default HistoryScreen;
