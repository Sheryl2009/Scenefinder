import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CONFIG } from '../constants/design';
import type { SearchHistoryItem, UserPreferences } from '../types';

/**
 * Storage Service for local data persistence
 */
class StorageService {
  /**
   * Save recent searches to local storage
   */
  async saveRecentSearch(search: Omit<SearchHistoryItem, 'id' | 'searchedAt'>): Promise<void> {
    try {
      const existing = await this.getRecentSearches();
      
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        searchedAt: new Date().toISOString(),
      };

      // Add new search at the beginning, limit to maxRecentSearches
      const updated = [newSearch, ...existing].slice(0, CONFIG.maxRecentSearches);
      
      await AsyncStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }

  /**
   * Get all recent searches from local storage
   */
  async getRecentSearches(): Promise<SearchHistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.recentSearches);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  /**
   * Delete a specific search from history
   */
  async deleteRecentSearch(id: string): Promise<void> {
    try {
      const existing = await this.getRecentSearches();
      const filtered = existing.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting recent search:', error);
    }
  }

  /**
   * Clear all recent searches
   */
  async clearRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.recentSearches);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }

  /**
   * Save user preferences
   */
  async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const existing = await this.getUserPreferences();
      const updated = { ...existing, ...preferences };
      await AsyncStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.userPreferences);
      if (data) {
        return JSON.parse(data);
      }
      return {
        notificationsEnabled: true,
        cacheEnabled: true,
        cacheSize: 0,
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        notificationsEnabled: true,
        cacheEnabled: true,
        cacheSize: 0,
      };
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(STORAGE_KEYS.recentSearches) ||
        key.startsWith(STORAGE_KEYS.userPreferences));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache size in bytes (approximate)
   */
  async getCacheSize(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.recentSearches);
      return data ? data.length : 0;
    } catch (error) {
      return 0;
    }
  }
}

export const storageService = new StorageService();
export default storageService;
