import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storage';
import type { SearchHistoryItem } from '../types';

/**
 * Hook for managing search history
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searches = await storageService.getRecentSearches();
      setHistory(searches);
    } catch (err) {
      setError('Failed to load search history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSearch = useCallback(async (id: string) => {
    try {
      await storageService.deleteRecentSearch(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete search');
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await storageService.clearRecentSearches();
      setHistory([]);
    } catch (err) {
      setError('Failed to clear history');
    }
  }, []);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    error,
    loadHistory,
    deleteSearch,
    clearHistory,
    refresh: loadHistory,
  };
}
