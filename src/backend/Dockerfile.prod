FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for image processing and docker-compose
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

# Create uploads and data directories
RUN mkdir -p uploads/reception_images data

EXPOSE 9001

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:9001"]