# SceneFinder UI/UX Design Document

## 1. Design Philosophy

SceneFinder is a **cinematic, immersive** experience that feels like browsing through Hollywood's greatest moments. The app should feel premium and exciting—like holding a pocket window to global entertainment.

**Core Design Principles:**
- **Cinematic**: Dark, rich backgrounds with vibrant accent colors evoking movie theaters
- **Instant**: Lightning-fast interactions with satisfying micro-animations
- **Discoverable**: Clear visual hierarchy that guides users naturally from upload to result
- **Trustworthy**: Professional polish that conveys AI accuracy and reliability

---

## 2. App Flow & User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Splash] → [Home/Upload] → [Processing] → [Results] →          │
│                                    ↓                             │
│                              [Movie Details]                      │
│                                    ↓                             │
│                              [Watch Providers]                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### User Journey Steps:
1. **Splash Screen** → Brand moment with animated logo (1.5s)
2. **Home/Upload** → Central upload CTA, recent searches
3. **Camera/Gallery Picker** → Image selection interface
4. **Processing** → AI analyzing screen with progress indicator
5. **Results** → Matched movie/scene with confidence score
6. **Movie Details** → Full metadata, cast, streaming options
7. **Watch Providers** → Where to stream the identified content

---

## 3. Key Screens Specification

### 3.1 Splash Screen
- **Background**: Deep black (#0A0A0A)
- **Logo**: "SceneFinder" in white/gradient text with subtle glow effect
- **Animation**: Logo fades in with gentle scale (0.9→1.0), 800ms ease-out
- **Duration**: 1.5 seconds auto-transition

### 3.2 Home/Upload Screen
- **Layout**: Full-screen with centered content
- **Background**: Dark gradient (#0A0A0A → #1A1A2E)
- **Hero Section**:
  - App title "SceneFinder" (32px, bold, white)
  - Tagline: "Identify any movie scene instantly" (16px, #888)
- **Upload CTA**:
  - Large circular button (120px diameter)
  - Gradient border (Cinema Red #E50914 → Purple #7B2CBF)
  - Camera icon in center (40px, white)
  - Pulse animation on idle
- **Below CTA**: "Tap to upload a screenshot" (14px, #666)
- **Recent Searches**: 
  - Horizontal scrollable list of recent thumbnails (60x60px rounded)
  - Max 10 items, persisted locally
- **Bottom Nav**: 4 tabs - Home | Search | History | Profile

### 3.3 Camera/Gallery Picker
- **Trigger**: Tap upload CTA opens ActionSheet
- **Options**:
  - "Take Photo" → Opens native camera
  - "Choose from Gallery" → Opens image picker
  - "Cancel"
- **Permissions**: Request camera/photo library access with rationale modal

### 3.4 Processing Screen
- **Layout**: Centered with animated element
- **Visual**: 
  - Uploaded image thumbnail (blurred, 150px)
  - Scanning line animation moving across
  - Circular progress indicator
- **Text**: "Analyzing scene..." (18px, white)
- **Subtext**: "Comparing against millions of frames" (14px, #888)
- **Estimated Time**: 2-3 seconds display

### 3.5 Results Screen
- **Layout**: Vertical scroll, header with back button
- **Match Card** (hero element):
  - Movie poster (200px width, rounded 12px)
  - Match confidence badge (top-right): "94% match" in green pill
  - Movie title (24px, bold, white)
  - Release year + Runtime (16px, #AAA)
  - Genre pills (horizontal list, 12px text)
- **Scene Details Section**:
  - "Identified Scene" label
  - Timestamp in movie (e.g., "1:42:15")
  - Brief scene description if available
- **Action Buttons**:
  - "View Details" → Primary CTA (gradient background)
  - "Share Result" → Secondary (outlined)
  - "Try Again" → Tertiary (text only)
- **Streaming Links Section**:
  - "Where to Watch" header
  - Provider logos horizontal scroll (Netflix, Prime, etc.)
  - "Available on [Provider]" + link

### 3.6 Movie Details Screen
- **Layout**: Full scroll with sticky header
- **Hero Backdrop**: Blurred movie backdrop image (height: 300px)
- **Poster + Info Card** (overlapping hero):
  - Movie poster (120px)
  - Title, year, rating (stars)
  - Runtime, Genres
- **Sections**:
  - **Overview**: Plot summary
  - **Cast**: Horizontal scrollable actor cards (80x80px)
  - **Similar Scenes**: Related matches from database
- **CTA**: "Find Streaming" button fixed at bottom

### 3.7 Watch Providers Screen
- **Layout**: List of providers
- **Provider Card**:
  - Logo (40px)
  - Provider name
  - Price/subscription type
  - "Watch Now" button → Deep link

### 3.8 Search History Screen
- **Layout**: List view
- **Search Item**:
  - Thumbnail (50x50px)
  - Movie title + timestamp
  - Date searched
  - Swipe to delete
- **Empty State**: "No searches yet" with illustration

### 3.9 Profile Screen
- **Layout**: Settings-style list
- **Sections**:
  - Account (placeholder for auth)
  - Preferences (Notifications, Cache)
  - About (Version, Terms, Privacy)
  - Clear Cache button

---

## 4. Visual Design Language

### 4.1 Color Palette
```
Primary Colors:
- Background Dark:    #0A0A0A (near black)
- Background Card:    #1A1A2E (dark blue-gray)
- Surface:           #252540 (elevated surfaces)

Accent Colors:
- Cinema Red:         #E50914 (Netflix-style red)
- Purple Accent:      #7B2CBF (vibrant purple)
- Gold:              #F5C518 (IMDb-style gold for ratings)

Text Colors:
- Primary Text:      #FFFFFF
- Secondary Text:    #AAAAAA
- Muted Text:        #666666

Status Colors:
- Success:           #4CAF50 (green)
- Warning:           #FFC107 (amber)
- Error:             #F44336 (red)

Gradients:
- CTA Gradient:      linear-gradient(135deg, #E50914, #7B2CBF)
- Hero Gradient:      linear-gradient(180deg, transparent, #0A0A0A)
```

### 4.2 Typography
```
Font Family: System default (San Francisco on iOS, Roboto on Android)

Sizes:
- Hero Title:        32px / bold
- Screen Title:      24px / bold
- Card Title:       18px / semibold
- Body:             16px / regular
- Caption:          14px / regular
- Micro:            12px / regular

Line Heights:
- Titles:           1.2
- Body:             1.5
- Caption:          1.4
```

### 4.3 Spacing System (8pt Grid)
```
- xs:    4px
- sm:    8px
- md:   16px
- lg:   24px
- xl:   32px
- xxl:  48px

Screen Padding: 16px horizontal
Card Padding:   16px all sides
Card Radius:    12px
Button Radius:  24px (pill shape)
```

### 4.4 Component Library

#### Buttons
- **Primary**: Gradient background (#E50914→#7B2CBF), white text, 48px height, pill radius
- **Secondary**: Transparent with gradient border, gradient text
- **Tertiary**: Text only, white text
- **States**: Default, Pressed (80% opacity), Disabled (30% opacity), Loading (spinner)

#### Cards
- **Movie Card**: Poster + info, dark surface background, 12px radius
- **Provider Card**: Logo + name + CTA, horizontal layout
- **History Item**: Thumbnail + text, full-width tap target

#### Inputs
- **Search Bar**: Dark surface, white text, search icon left, clear icon right
- **Height**: 48px, border-radius: 24px

#### Navigation
- **Bottom Tab Bar**: 4 items, icon + label, dark surface background
- **Header**: Transparent, back arrow, optional title

#### Feedback
- **Loading Spinner**: Circular, gradient stroke
- **Progress Bar**: Linear, gradient fill
- **Toast**: Dark surface, white text, auto-dismiss 3s
- **Badge**: Small pill, status color background

---

## 5. Interaction Patterns

### 5.1 Gestures
- **Tap**: Select items, trigger actions
- **Long Press**: Show context menu on history items
- **Swipe**: Delete history items (left swipe)
- **Pull to Refresh**: On history screen

### 5.2 Animations
- **Screen Transitions**: Fade + slide (300ms ease-in-out)
- **Card Press**: Scale to 0.97 + slight opacity drop (100ms)
- **CTA Pulse**: Subtle scale breathing animation (2s loop)
- **Processing Scan**: Horizontal line sweep (1.5s loop)
- **Loading**: Circular gradient rotation

### 5.3 Loading States
- **Skeleton Screens**: Placeholder cards while loading details
- **Spinner**: For actions in progress
- **Progress Bar**: For image upload/processing

### 5.4 Error States
- **Network Error**: "No internet connection" + retry button
- **API Error**: "Something went wrong" + retry button
- **No Match**: "No match found" + suggestion to try another image
- **Camera Denied**: Permission explanation + settings link

---

## 6. User Flow Diagram

```
                            ┌─────────────────┐
                            │   APP LAUNCH    │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  SPLASH SCREEN  │
                            │   (1.5 sec)     │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  HOME/ UPLOAD   │◄──────────────────┐
                            │                 │                   │
                            │  ┌───────────┐  │                   │
                            │  │  Upload   │  │                   │
                            │  │   CTA     │  │                   │
                            │  └─────┬─────┘  │                   │
                            └────────┼────────┘                   │
                                     │                            │
                    ┌─────────────────┼─────────────────┐        │
                    │                 │                 │        │
                    ▼                 ▼                 ▼        │
            ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
            │  CAMERA       │ │  GALLERY      │ │ RECENT SEARCH │ │
            │  (Native)     │ │  (Native)     │ │    (Tap)      │ │
            └───────┬───────┘ └───────┬───────┘ └───────┬───────┘ │
                    └─────────────────┼─────────────────┘         │
                                      │                          │
                                      ▼                          │
                            ┌─────────────────┐                  │
                            │   PROCESSING    │                  │
                            │   SCREEN        │                  │
                            └────────┬────────┘                  │
                                     │                          │
                                     ▼                          │
                            ┌─────────────────┐                  │
                            │    RESULTS      │                  │
                            │    SCREEN       │──────────────────┘
                            └────────┬────────┘
                                     │
                           ┌─────────┴─────────┐
                           │                   │
                           ▼                   ▼
                  ┌─────────────────┐ ┌─────────────────┐
                  │ MOVIE DETAILS   │ │ WATCH PROVIDERS │
                  │    SCREEN       │ │    SCREEN       │
                  └────────┬────────┘ └────────┬────────┘
                           │                   │
                           └─────────┬─────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  DEEP LINK TO   │
                            │ STREAMING APP   │
                            └─────────────────┘
```

---

## 7. Responsive Considerations

### 7.1 Phone vs Tablet
- **Phone**: Single column, stacked layout
- **Tablet**: Two-column grid for results, larger images
- **Orientation**: Support both portrait and landscape

### 7.2 Safe Areas
- Respect notch/Dynamic Island on iOS
- Respect navigation bar on Android
- Bottom tab bar above home indicator

---

## 8. Accessibility

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 minimum
- Screen reader labels on all interactive elements
- Haptic feedback on key actions

---

## 9. Technical Implementation Notes

### 9.1 Recommended Libraries
- Navigation: @react-navigation/native
- Image Picker: react-native-image-picker
- Camera: react-native-vision-camera (optional, use native as fallback)
- Storage: @react-native-async-storage/async-storage
- HTTP Client: axios
- State: React Query for server state, Context for UI state
- Animations: react-native-reanimated

### 9.2 API Integration Points
- `POST /v1/identify` - Upload image for scene identification
- `GET /v1/movies/{id}` - Fetch movie details
- `GET /v1/history` - Fetch user search history
- `GET /v1/trending` - Fetch trending scenes

### 9.3 Local Storage
- Recent searches (last 10) cached locally
- User preferences (notifications, cache settings)
- Offline movie details cache (optional)

---

## 10. Success Criteria

- [ ] User can upload image in < 2 taps
- [ ] Processing feedback is clear and engaging
- [ ] Results are visually compelling and accurate
- [ ] Streaming links are easily accessible
- [ ] History is searchable and deletable
- [ ] App maintains 60fps throughout interactions
- [ ] Error states are handled gracefully
