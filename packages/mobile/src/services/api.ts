import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, CONFIG } from '../constants/design';
import type { 
  IdentifyResponse, 
  Movie, 
  SearchHistoryItem, 
  TrendingItem 
} from '../types';

// API Service singleton
class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: CONFIG.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Identify a scene from an image URI
   * @param imageUri - Local URI of the image to identify
   * @returns Promise with identify response containing match details
   */
  async identifyScene(imageUri: string): Promise<IdentifyResponse> {
    try {
      const formData = new FormData();
      
      // Get filename from URI
      const filename = imageUri.split('/').pop() || 'screenshot.jpg';
      
      // Append image file to form data
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: 'image/jpeg',
      } as unknown as Blob);

      const response = await this.client.post<IdentifyResponse>(
        '/identify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get detailed movie information
   * @param movieId - TMDB movie ID
   * @returns Promise with movie details
   */
  async getMovieDetails(movieId: number): Promise<Movie> {
    try {
      const response = await this.client.get<Movie>(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's search history
   * @returns Promise with array of search history items
   */
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
      const response = await this.client.get<SearchHistoryItem[]>('/history');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending/popular scenes
   * @returns Promise with array of trending items
   */
  async getTrending(): Promise<TrendingItem[]> {
    try {
      const response = await this.client.get<TrendingItem[]>('/trending');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and normalize API errors
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response) {
        // Server responded with error
        const message = axiosError.response.data?.message || 'Server error occurred';
        return new Error(message);
      } else if (axiosError.request) {
        // No response received
        return new Error('Network error: Unable to reach server');
      }
    }
    
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
