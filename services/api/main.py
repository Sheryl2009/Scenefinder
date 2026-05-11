import os
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Depends
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import the ML pipeline from our libs
pipeline = None
try:
    from libs.ml.pipeline import SceneRecognitionPipeline
    
    # Initialize ML Pipeline
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")

    if PINECONE_API_KEY and TMDB_API_KEY:
        try:
            pipeline = SceneRecognitionPipeline(
                pinecone_api_key=PINECONE_API_KEY,
                tmdb_api_key=TMDB_API_KEY
            )
        except Exception as e:
            print(f"Error initializing ML pipeline: {e}")
except ImportError:
    print("ML libraries not found, running in mock mode")

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="SceneFinder API",
    description="Backend API for AI-powered scene recognition",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- Models ---

class MovieMetadata(BaseModel):
    tmdb_id: int
    title: str
    overview: Optional[str] = None
    release_date: Optional[str] = None
    poster_url: Optional[str] = None

class SceneMatch(BaseModel):
    movie_id: int
    title: str
    confidence: float
    timestamp: int
    poster_url: Optional[str] = None
    overview: Optional[str] = None

class IdentifyResponse(BaseModel):
    request_id: str
    matches: List[SceneMatch]

class WatchProviderResponse(BaseModel):
    tmdb_id: int
    providers: List[str]

# --- Endpoints ---

@app.get("/")
async def root():
    return {"status": "online", "message": "Welcome to SceneFinder API"}

@app.post("/v1/identify", response_model=IdentifyResponse)
@limiter.limit("5/minute")
async def identify_scene(request: Request, image: UploadFile = File(...)):
    """
    Identifies a movie scene from an uploaded screenshot.
    """
    request_id = str(uuid.uuid4())
    
    # Save temporary file for the pipeline
    temp_path = f"/tmp/{request_id}_{image.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await image.read())
    
    try:
        if pipeline:
            matches = pipeline.identify_scene(temp_path)
            return {
                "request_id": request_id,
                "matches": matches
            }
        else:
            # Mock response if pipeline is not initialized
            return {
                "request_id": request_id,
                "matches": [
                    {
                        "movie_id": 27205,
                        "title": "Inception (Mock)",
                        "confidence": 0.98,
                        "timestamp": 4500,
                        "poster_url": "https://image.tmdb.org/t/p/w500/edvWebvB7noVElDcj9160rAW2o2.jpg",
                        "overview": "A thief who steals corporate secrets through the use of dream-sharing technology..."
                    }
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/v1/movie/{tmdb_id}", response_model=MovieMetadata)
async def get_movie_metadata(tmdb_id: int):
    """
    Fetches detailed metadata for a specific movie.
    """
    if pipeline:
        try:
            details = pipeline.tmdb.get_movie_details(tmdb_id)
            return {
                "tmdb_id": tmdb_id,
                "title": details.get("title"),
                "overview": details.get("overview"),
                "release_date": details.get("release_date"),
                "poster_url": f"https://image.tmdb.org/t/p/w500{details.get('poster_path')}"
            }
        except Exception as e:
            raise HTTPException(status_code=404, detail="Movie not found or TMDB error")
    
    # Mock fallback
    if tmdb_id == 27205:
        return {
            "tmdb_id": 27205,
            "title": "Inception",
            "overview": "A thief who steals corporate secrets...",
            "release_date": "2010-07-16",
            "poster_url": "https://image.tmdb.org/t/p/w500/edvWebvB7noVElDcj9160rAW2o2.jpg"
        }
    
    raise HTTPException(status_code=404, detail="Movie not found")

@app.get("/v1/watch/{tmdb_id}", response_model=WatchProviderResponse)
async def get_watch_providers(tmdb_id: int):
    """
    Returns available streaming platforms for a specific movie.
    """
    if pipeline:
        try:
            if hasattr(pipeline.tmdb, 'get_streaming_providers'):
                results = pipeline.tmdb.get_streaming_providers(tmdb_id)
                # Process TMDB results (usually nested by country)
                # For MVP, just list some common ones or US
                us_providers = results.get("US", {}).get("flatrate", [])
                provider_names = [p["provider_name"] for p in us_providers]
                return {"tmdb_id": tmdb_id, "providers": provider_names}
            else:
                return {"tmdb_id": tmdb_id, "providers": ["Netflix", "HBO Max"]}
        except Exception:
            return {"tmdb_id": tmdb_id, "providers": []}
            
    return {"tmdb_id": tmdb_id, "providers": ["Netflix", "HBO Max"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
