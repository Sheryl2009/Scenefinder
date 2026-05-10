// Design System Constants for SceneFinder

export const COLORS = {
  // Backgrounds
  backgroundDark: '#0A0A0A',
  backgroundCard: '#1A1A2E',
  surface: '#252540',
  
  // Accent Colors
  cinemaRed: '#E50914',
  purpleAccent: '#7B2CBF',
  gold: '#F5C518',
  
  // Text Colors
  primaryText: '#FFFFFF',
  secondaryText: '#AAAAAA',
  mutedText: '#666666',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  
  // Gradients (for reference)
  gradientStart: '#E50914',
  gradientEnd: '#7B2CBF',
} as const;

export const GRADIENTS = {
  cta: ['#E50914', '#7B2CBF'],
  hero: ['transparent', '#0A0A0A'],
} as const;

export const TYPOGRAPHY = {
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  micro: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  card: 12,
  button: 24,
  input: 24,
  small: 8,
} as const;

export const API_BASE_URL = 'https://api.scenefinder.app/v1';

export const ENDPOINTS = {
  identify: '/identify',
  movie: (id: number) => `/movies/${id}`,
  history: '/history',
  trending: '/trending',
} as const;

export const STORAGE_KEYS = {
  recentSearches: 'recent_searches',
  userPreferences: 'user_preferences',
  cacheExpiry: 'cache_expiry',
} as const;

export const CONFIG = {
  maxRecentSearches: 10,
  apiTimeout: 30000,
  imageMaxSize: 5242880, // 5MB
  confidenceThreshold: 0.7,
} as const;
