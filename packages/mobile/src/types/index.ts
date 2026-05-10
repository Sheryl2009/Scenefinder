// SceneFinder Type Definitions

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number | null;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  streaming_providers?: StreamingProvider[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface StreamingProvider {
  id: number;
  name: string;
  logo_path: string;
  price?: number;
  type: 'subscription' | 'rent' | 'buy';
}

export interface SceneMatch {
  movie_id: number;
  movie_title: string;
  confidence: number;
  timestamp: string;
  frame_url?: string;
  scene_description?: string;
  poster_url?: string;
  backdrop_url?: string;
}

export interface IdentifyResponse {
  success: boolean;
  match: SceneMatch;
  all_matches: SceneMatch[];
}

export interface SearchHistoryItem {
  id: string;
  imageUri: string;
  movieId: number;
  movieTitle: string;
  confidence: number;
  timestamp: string;
  searchedAt: string;
}

export interface TrendingItem {
  movie_id: number;
  movie_title: string;
  search_count: number;
  poster_url?: string;
  last_searched: string;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  cacheEnabled: boolean;
  cacheSize: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: 'uploading' | 'analyzing' | 'matching';
}

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  MovieDetails: { movieId: number };
  WatchProviders: { movieId: number };
  Processing: { imageUri: string };
  Results: { match: SceneMatch };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  History: undefined;
  Profile: undefined;
};
