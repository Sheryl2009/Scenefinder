import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from './constants/design';
import type { 
  RootStackParamList, 
  MainTabParamList, 
  SceneMatch, 
  SearchHistoryItem,
  ProcessingState 
} from './types';
import { useSearchHistory, useIdentifyScene } from './hooks';
import { storageService } from './services/storage';
import { pickImage } from './services/media';

import {
  SplashScreen,
  HomeScreen,
  ProcessingScreen,
  ResultsScreen,
  MovieDetailsScreen,
  WatchProvidersScreen,
  HistoryScreen,
  ProfileScreen,
} from './screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Tab Navigator Component
const MainTabs: React.FC<{
  onImageSelected: (uri: string) => void;
  onRecentSearchPress: (item: SearchHistoryItem) => void;
  onClearCache: () => void;
}> = ({ onImageSelected, onRecentSearchPress, onClearCache }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundCard,
          borderTopColor: COLORS.surface,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.cinemaRed,
        tabBarInactiveTintColor: COLORS.mutedText,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIcon}><HomeIcon color={color} /></View>
          ),
          tabBarLabel: 'Home',
        }}
      >
        {() => (
          <HomeScreenWrapper
            onImageSelected={onImageSelected}
            onRecentSearchPress={onRecentSearchPress}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        component={SearchPlaceholder}
        options={{
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="History"
        options={{
          tabBarIcon: ({ color }) => <HistoryIcon color={color} />,
          tabBarLabel: 'History',
        }}
      >
        {() => (
          <HistoryScreenWrapper onItemPress={onRecentSearchPress} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          tabBarLabel: 'Profile',
        }}
      >
        {() => <ProfileScreenWrapper onClearCache={onClearCache} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Simple icon components
const HomeIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.tabIcon, { backgroundColor: color }]} />
);
const SearchIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.tabIcon, { backgroundColor: color }]} />
);
const HistoryIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.tabIcon, { backgroundColor: color }]} />
);
const ProfileIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.tabIcon, { backgroundColor: color }]} />
);

// Placeholder screens
const SearchPlaceholder: React.FC = () => null;

const HomeScreenWrapper: React.FC<{
  onImageSelected: (uri: string) => void;
  onRecentSearchPress: (item: SearchHistoryItem) => void;
}> = ({ onImageSelected, onRecentSearchPress }) => {
  const { history, loadHistory } = useSearchHistory();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <HomeScreen
      recentSearches={history}
      onImageSelected={onImageSelected}
      onRecentSearchPress={onRecentSearchPress}
    />
  );
};

const HistoryScreenWrapper: React.FC<{
  onItemPress: (item: SearchHistoryItem) => void;
}> = ({ onItemPress }) => {
  const { history, isLoading, loadHistory, deleteSearch, clearHistory } = useSearchHistory();

  return (
    <HistoryScreen
      history={history}
      onItemPress={onItemPress}
      onDeleteItem={deleteSearch}
      onClearAll={clearHistory}
      isLoading={isLoading}
    />
  );
};

const ProfileScreenWrapper: React.FC<{
  onClearCache: () => void;
}> = ({ onClearCache }) => {
  return <ProfileScreen onClearCache={onClearCache} />;
};

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'main'>('splash');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<SceneMatch | null>(null);
  
  const {
    isProcessing,
    progress,
    stage,
    identifyScene,
    reset,
  } = useIdentifyScene();

  const handleSplashFinish = useCallback(() => {
    setCurrentScreen('main');
    setIsLoading(false);
  }, []);

  const handleImageSelected = useCallback(async (uri: string) => {
    setSelectedImage(uri);
    setMatchResult(null);
    
    // Navigate to processing screen and start identification
    const match = await identifyScene(uri);
    if (match) {
      setMatchResult(match);
    }
  }, [identifyScene]);

  const handleRecentSearchPress = useCallback((item: SearchHistoryItem) => {
    // Re-run identification with the saved image
    if (item.imageUri) {
      handleImageSelected(item.imageUri);
    }
  }, [handleImageSelected]);

  const handleViewDetails = useCallback(() => {
    // Navigation handled by stack
  }, []);

  const handleWatchProviders = useCallback(() => {
    // Navigation handled by stack
  }, []);

  const handleTryAgain = useCallback(() => {
    setSelectedImage(null);
    setMatchResult(null);
    reset();
  }, [reset]);

  const handleClearCache = useCallback(() => {
    // Cache cleared, UI will update
  }, []);

  const handleBack = useCallback(() => {
    setSelectedImage(null);
    setMatchResult(null);
    reset();
  }, [reset]);

  if (currentScreen === 'splash') {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: COLORS.cinemaRed,
              background: COLORS.backgroundDark,
              card: COLORS.backgroundCard,
              text: COLORS.primaryText,
              border: COLORS.surface,
              notification: COLORS.cinemaRed,
            },
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.backgroundDark },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Main">
              {() => (
                <MainTabs
                  onImageSelected={handleImageSelected}
                  onRecentSearchPress={handleRecentSearchPress}
                  onClearCache={handleClearCache}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="Processing">
              {() => (
                <ProcessingScreen
                  imageUri={selectedImage || ''}
                  progress={progress}
                  stage={stage}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="Results">
              {() => (
                <ResultsScreen
                  match={matchResult!}
                  onViewDetails={handleViewDetails}
                  onWatchProviders={handleWatchProviders}
                  onTryAgain={handleTryAgain}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="MovieDetails">
              {({ route }) => (
                <MovieDetailsScreen
                  movieId={route.params.movieId}
                  onBack={handleBack}
                  onWatchProviders={handleWatchProviders}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="WatchProviders">
              {({ route }) => (
                <WatchProvidersScreen
                  movieId={route.params.movieId}
                  onBack={handleBack}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  tabIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});

export { App };
