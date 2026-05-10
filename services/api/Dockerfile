FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY services/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire monorepo structure needed for imports
COPY libs/ /app/libs/
COPY services/api/ /app/services/api/

ENV PYTHONPATH=/app
WORKDIR /app/services/api

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
