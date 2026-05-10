from .encoder import SceneEncoder
from .vector_db import VectorDB
from .metadata_sync import TMDBClient

class SceneRecognitionPipeline:
    def __init__(self, pinecone_api_key=None, tmdb_api_key=None, model_name="openai/clip-vit-base-patch32", dimension=512):
        self.encoder = SceneEncoder(model_name=model_name)
        self.vector_db = VectorDB(api_key=pinecone_api_key, dimension=dimension)
        self.tmdb = TMDBClient(api_key=tmdb_api_key)

    def identify_scene(self, image_path):
        # 1. Extract features
        embedding = self.encoder.encode_image(image_path)
        
        # 2. Search in Vector DB
        results = self.vector_db.query_vector(embedding, top_k=5)
        
        # 3. Process matches and enrich with metadata
        matches = []
        for match in results.get("matches", []):
            tmdb_id = match.metadata.get("tmdb_id")
            confidence = match.score
            
            # Fetch metadata from TMDB (could be cached in production)
            movie_details = self.tmdb.get_movie_details(tmdb_id)
            
            matches.append({
                "movie_id": tmdb_id,
                "title": movie_details.get("title"),
                "confidence": confidence,
                "timestamp": match.metadata.get("timestamp"),
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie_details.get('poster_path')}",
                "overview": movie_details.get("overview")
            })
            
        return matches

    def index_scene(self, image_path, tmdb_id, timestamp, frame_url):
        # 1. Extract features
        embedding = self.encoder.encode_image(image_path)
        
        # 2. Upsert to Vector DB
        vector_id = f"frame_{tmdb_id}_{timestamp}"
        metadata = {
            "tmdb_id": tmdb_id,
            "timestamp": timestamp,
            "frame_url": frame_url
        }
        self.vector_db.upsert_vector(vector_id, embedding, metadata)
