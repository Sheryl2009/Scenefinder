import { useState, useCallback } from 'react';
import { storageService } from '../services/storage';
import type { UserPreferences } from '../types';

/**
 * Hook for managing user preferences
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    notificationsEnabled: true,
    cacheEnabled: true,
    cacheSize: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await storageService.getUserPreferences();
      setPreferences(prefs);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      try {
        const updated = { ...preferences, ...updates };
        await storageService.saveUserPreferences(updates);
        setPreferences(updated);
      } catch (err) {
        console.error('Failed to update preferences:', err);
      }
    },
    [preferences]
  );

  const clearCache = useCallback(async () => {
    try {
      await storageService.clearCache();
      setPreferences((prev) => ({ ...prev, cacheSize: 0 }));
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  }, []);

  const getCacheSize = useCallback(async () => {
    const size = await storageService.getCacheSize();
    setPreferences((prev) => ({ ...prev, cacheSize: size }));
    return size;
  }, []);

  return {
    preferences,
    isLoading,
    loadPreferences,
    updatePreferences,
    clearCache,
    getCacheSize,
  };
}
