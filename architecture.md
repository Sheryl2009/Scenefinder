# SceneFinder Technical Architecture Document

## 1. Overview
SceneFinder is a next-generation AI-powered entertainment discovery platform. It allows users to identify movies and TV scenes from screenshots or short clips using advanced computer vision and similarity search.

## 2. System Architecture High-Level
The system follows a classic Client-Server architecture with a specialized AI inference and search pipeline.

### Component Diagram (Conceptual)
```text
[Mobile App (React Native)] 
      |
      V
[API Gateway / Load Balancer]
      |
      V
[Backend API (FastAPI)] <---> [Auth Service (Firebase/Auth0)]
      |          |
      |          +----------> [Metadata DB (PostgreSQL)]
      |          |
      |          +----------> [TMDB API (External)]
      V
[AI Inference Pipeline]
      |
      +--> [CLIP Model Service (Torch/Onnx)]
      |
      +--> [Vector Database (Pinecone)]
```

## 3. Technology Stack

### 3.1 Mobile Frontend
- **Framework**: React Native (TypeScript)
- **State Management**: Redux Toolkit or React Query
- **Navigation**: React Navigation
- **Image Handling**: `react-native-image-picker`, `react-native-vision-camera`

### 3.2 Backend API
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Task Queue**: Celery with Redis (for long-running ingestion/indexing)
- **Database**: PostgreSQL (for user data, search history, cached metadata)
- **ORM**: SQLAlchemy or Tortoise-ORM

### 3.3 AI & Machine Learning
- **Model**: CLIP (ViT-B/32 or ViT-L/14) for generating multi-modal embeddings.
- **Vector Search**: Pinecone (Vector Database)
- **Image Preprocessing**: Pillow, OpenCV

### 3.4 Infrastructure & DevOps
- **Cloud Provider**: AWS
- **Compute**: AWS Lambda (for API) or ECS Fargate (for model inference if not using a hosted model API)
- **Storage**: AWS S3 (for image uploads and frame datasets)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (Error tracking), Prometheus/Grafana

## 4. Data Flows

### 4.1 Ingestion Phase (Background)
1. **Crawl**: Fetch movie frames from datasets or video files.
2. **Embed**: Generate embeddings for each frame using the CLIP image encoder.
3. **Index**: Store embeddings in Pinecone with metadata (Movie ID, Timestamp, Frame URL).
4. **Metadata Sync**: Store detailed movie metadata in PostgreSQL (synced from TMDB).

### 4.2 Search Phase (Real-time)
1. **Upload**: User captures/selects a screenshot via the Mobile App.
2. **Preprocessing**: Backend resizes/normalizes the image (224x224 for CLIP).
3. **Embedding**: Backend passes the image through the CLIP model to get a feature vector.
4. **Vector Search**: Query Pinecone with the vector to find the Top-K nearest neighbors.
5. **Ranking**: Re-rank results based on cosine similarity scores.
6. **Enrichment**: Fetch movie details (title, cast, streaming links) from TMDB/PostgreSQL.
7. **Response**: Return the best match (or multiple candidates) to the user.

## 5. Database Schema

### 5.1 PostgreSQL (Relational)

#### Table: `users`
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `username`: String (Unique)
- `auth_provider_id`: String (Foreign ID from Firebase/Auth0)
- `created_at`: Timestamp

#### Table: `movies_cache`
- `tmdb_id`: Integer (Primary Key)
- `title`: String
- `overview`: Text
- `release_date`: Date
- `poster_path`: String
- `backdrop_path`: String
- `streaming_providers`: JSONB (Store available platforms)
- `last_updated`: Timestamp

#### Table: `search_history`
- `id`: UUID (Primary Key)
- `user_id`: UUID (FK -> users.id)
- `image_s3_url`: String
- `detected_tmdb_id`: Integer (FK -> movies_cache.tmdb_id)
- `confidence_score`: Float
- `timestamp`: Integer (Offset in seconds within the movie)
- `created_at`: Timestamp

### 5.2 Pinecone (Vector)
- **Namespace**: `scenes`
- **ID**: `frame_{tmdb_id}_{timestamp_seconds}`
- **Vector**: 512-dim or 768-dim float array (CLIP embedding)
- **Metadata**:
  ```json
  {
    "tmdb_id": 12345,
    "timestamp": 3600,
    "frame_url": "https://s3.amazonaws.com/frames/12345/3600.jpg"
  }
  ```

## 6. API Contracts

### 6.1 Identify Scene
`POST /v1/identify`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image: File`

**Response (200 OK):**
```json
{
  "request_id": "uuid",
  "matches": [
    {
      "movie_id": 12345,
      "title": "Inception",
      "timestamp": 4560,
      "confidence": 0.92,
      "poster_url": "https://...",
      "streaming_on": ["Netflix", "HBO Max"]
    }
  ]
}
```

### 6.2 Get Movie Details
`GET /v1/movies/{tmdb_id}`

**Response (200 OK):**
```json
{
  "tmdb_id": 12345,
  "title": "Inception",
  "overview": "...",
  "release_date": "2010-07-16",
  "cast": [...],
  "streaming_providers": {
    "US": ["Netflix", "Apple TV"]
  }
}
```

### 6.3 User History
`GET /v1/history`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
[
  {
    "search_id": "uuid",
    "image_url": "https://...",
    "movie_title": "Inception",
    "created_at": "2024-05-10T12:00:00Z"
  }
]
```

## 7. Scalability & Performance
- **Caching**: Redis for TMDB API results (TTL 24h).
- **Asynchronous Processing**: Image ingestion/indexing handled by Celery.
- **CDN**: CloudFront for serving cached movie posters and frames.

## 8. Security
- **Auth**: Firebase Authentication (OIDC).
- **API Security**: CORS, Rate Limiting (10 identifies/min for free tier).
- **Data**: S3 Bucket policies for signed URLs.

## 9. Development Workflow
- **Monorepo**:
  - `/packages/mobile`: React Native app
  - `/services/api`: FastAPI backend
  - `/services/ml`: CLIP inference & indexing scripts
- **CI/CD**: GitHub Actions for linting, testing, and Docker builds.

## 10. Success Metrics
- **P95 Latency**: < 1.5s for `POST /identify`.
- **Top-1 Accuracy**: > 85% on standard benchmark datasets.
