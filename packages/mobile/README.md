# SceneFinder Mobile App

AI-powered entertainment discovery platform - identify movies and TV scenes from screenshots.

## Features

- **Instant Scene Identification**: Upload any screenshot and get instant movie/TV show matches
- **AI-Powered**: Uses advanced CLIP model for accurate scene matching
- **Streaming Integration**: Find where to watch identified content
- **Search History**: Track your past scene identifications
- **Offline Support**: Local caching for faster searches

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: React Query
- **Navigation**: React Navigation
- **API**: RESTful backend with FastAPI

## Project Structure

```
mobile-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # Design system constants
│   ├── hooks/           # Custom React hooks
│   ├── screens/         # App screens
│   ├── services/        # API, storage, media services
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── App.tsx              # Entry point
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Screens

1. **Splash Screen** - Brand introduction
2. **Home/Upload** - Central upload CTA with recent searches
3. **Processing** - Animated scene analysis visualization
4. **Results** - Matched movie with confidence score
5. **Movie Details** - Full movie metadata, cast, genres
6. **Watch Providers** - Streaming platform links
7. **History** - Past search queries
8. **Profile** - User preferences and settings

## API Integration

The app connects to the SceneFinder backend API:

- `POST /v1/identify` - Upload image for scene identification
- `GET /v1/movies/{id}` - Fetch movie details
- `GET /v1/history` - Fetch user search history
- `GET /v1/trending` - Fetch trending scenes

## Design System

- **Colors**: Dark cinematic theme with Cinema Red (#E50914) and Purple (#7B2CBF) accents
- **Typography**: System fonts with clear hierarchy
- **Spacing**: 8pt grid system
- **Components**: Reusable cards, buttons, and inputs

## Architecture

The app follows a clean architecture pattern:

- **UI Layer**: React components and screens
- **Business Logic**: Custom hooks for state management
- **Data Layer**: Services for API calls and local storage

## License

MIT License - See LICENSE file for details.
