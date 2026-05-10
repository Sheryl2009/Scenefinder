import os
import io
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "online", "message": "Welcome to SceneFinder API"}

def test_identify_scene_mock():
    # Create a mock image file
    file = io.BytesIO(b"fake image data")
    response = client.post(
        "/v1/identify",
        files={"image": ("test.jpg", file, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "request_id" in data
    assert "matches" in data
    assert len(data["matches"]) > 0
    # Should return mock data if pipeline is not initialized
    assert "Inception" in data["matches"][0]["title"]

def test_get_movie_metadata():
    # Testing with mock ID
    response = client.get("/v1/movie/27205")
    assert response.status_code == 200
    assert response.json()["title"] == "Inception"

def test_get_watch_providers():
    response = client.get("/v1/watch/27205")
    assert response.status_code == 200
    assert "providers" in response.json()

def test_rate_limiting():
    # Resetting client to clear state if necessary, 
    # but slowapi usually tracks by IP which is 127.0.0.1 here.
    # We'll just hit it multiple times.
    file = io.BytesIO(b"fake image data")
    for _ in range(6):
        response = client.post(
            "/v1/identify",
            files={"image": ("test.jpg", file, "image/jpeg")}
        )
    assert response.status_code == 429
