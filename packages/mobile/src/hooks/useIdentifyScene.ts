import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import type { SceneMatch, IdentifyResponse } from '../types';

/**
 * Hook for handling scene identification logic
 */
export function useIdentifyScene() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'uploading' | 'analyzing' | 'matching'>('uploading');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SceneMatch | null>(null);

  const identifyScene = useCallback(async (imageUri: string): Promise<SceneMatch | null> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Stage 1: Uploading (0-30%)
      setStage('uploading');
      setProgress(10);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 30));
      }, 100);

      // Stage 2: Analyzing (30-70%)
      setTimeout(() => {
        setStage('analyzing');
      }, 500);

      const analyzingInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 8, 70));
      }, 150);

      // Stage 3: Matching (70-100%)
      setTimeout(() => {
        setStage('matching');
      }, 1500);

      // Make API call
      const response: IdentifyResponse = await apiService.identifyScene(imageUri);
      
      clearInterval(uploadInterval);
      clearInterval(analyzingInterval);
      setProgress(100);

      if (response.success && response.match) {
        setResult(response.match);

        // Save to local history
        await storageService.saveRecentSearch({
          imageUri,
          movieId: response.match.movie_id,
          movieTitle: response.match.movie_title,
          confidence: response.match.confidence,
          timestamp: response.match.timestamp,
        });

        return response.match;
      } else {
        setError('No match found for this scene');
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to identify scene';
      setError(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setStage('uploading');
    setError(null);
    setResult(null);
  }, []);

  return {
    isProcessing,
    progress,
    stage,
    error,
    result,
    identifyScene,
    reset,
  };
}
