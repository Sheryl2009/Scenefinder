# SceneFinder

> AI-powered movie scene recognition platform — identify any movie or TV show scene from a screenshot.

## 🏗️ Architecture

SceneFinder uses a modular monorepo structure:

```
scenefinder/
├── packages/mobile/       # React Native (Expo) mobile app
├── services/api/           # FastAPI backend
├── services/ml/            # CLIP-based scene recognition pipeline
└── .github/workflows/       # CI/CD pipelines
```

## 🔑 Key Technologies

| Layer | Tech |
|-------|------|
| Mobile | React Native (Expo), TypeScript, React Query |
| Backend | Python 3.11+, FastAPI, Pydantic |
| AI | OpenAI CLIP (ViT-B/32), Pinecone vector DB |
| Metadata | TMDB API |
| Infrastructure | AWS (ECS Fargate, S3, CloudFront) |

## 🚀 Getting Started

### Backend
```bash
cd services/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Mobile App
```bash
cd packages/mobile
npm install
npx expo start
```

### ML Service
```bash
cd services/ml
pip install -r requirements.txt
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/identify` | Identify a movie scene from an image |
| `GET` | `/v1/movie/{tmdb_id}` | Get movie metadata |
| `GET` | `/v1/watch/{tmdb_id}` | Get streaming providers |

## 🔒 Environment Variables

- `PINECONE_API_KEY` — Pinecone vector DB access
- `TMDB_API_KEY` — TMDB movie metadata API
- `FIREBASE_API_KEY` — Firebase auth (optional for MVP)

## 📦 Deployment

The backend ships with a `Dockerfile` for containerized deployment on AWS ECS.

## 📄 License

MIT