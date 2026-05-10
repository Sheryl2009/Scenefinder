import os
import requests

class TMDBClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("TMDB_API_KEY")
        if not self.api_key:
            raise ValueError("TMDB_API_KEY is not set")
        self.base_url = "https://api.themoviedb.org/3"

    def get_movie_details(self, tmdb_id):
        url = f"{self.base_url}/movie/{tmdb_id}"
        params = {
            "api_key": self.api_key,
            "append_to_response": "credits,videos"
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def search_movie(self, query):
        url = f"{self.base_url}/search/movie"
        params = {
            "api_key": self.api_key,
            "query": query
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get("results", [])

    def get_streaming_providers(self, tmdb_id):
        url = f"{self.base_url}/movie/{tmdb_id}/watch/providers"
        params = {
            "api_key": self.api_key
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get("results", {})
