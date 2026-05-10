import os
from pinecone import Pinecone, ServerlessSpec

class VectorDB:
    def __init__(self, api_key=None, index_name="scenefinder", dimension=512):
        self.api_key = api_key or os.getenv("PINECONE_API_KEY")
        if not self.api_key:
            raise ValueError("PINECONE_API_KEY is not set")
        
        self.pc = Pinecone(api_key=self.api_key)
        self.index_name = index_name
        
        # Create index if it doesn't exist
        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=dimension,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
        
        self.index = self.pc.Index(self.index_name)

    def upsert_vector(self, vector_id, vector, metadata):
        self.index.upsert(vectors=[(vector_id, vector, metadata)])

    def query_vector(self, vector, top_k=5):
        return self.index.query(vector=vector, top_k=top_k, include_metadata=True)
