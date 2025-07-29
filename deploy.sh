#!/bin/bash

# FaydaPass Docker Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-development}
IMAGE_NAME="faydapass"
CONTAINER_NAME="faydapass-$ENVIRONMENT"

echo "🚀 Deploying FaydaPass ($ENVIRONMENT)..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || echo "No existing container to stop"
docker rm $CONTAINER_NAME 2>/dev/null || echo "No existing container to remove"

# Run the new container
echo "▶️  Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  $IMAGE_NAME

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
  echo "✅ Container is running!"

  # Test health endpoint
  echo "🏥 Testing health endpoint..."
  if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Health check passed!"
    echo "🌐 Application is available at: http://localhost:3000"
  else
    echo "❌ Health check failed!"
    echo "📋 Container logs:"
    docker logs $CONTAINER_NAME
  fi
else
  echo "❌ Container failed to start!"
  echo "📋 Container logs:"
  docker logs $CONTAINER_NAME
  exit 1
fi

echo "🎉 Deployment complete!"
