#!/bin/bash

echo "🔍 Verifying Docker Deployment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi
echo "✅ Docker is running"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copy from deploy/docker.env.example"
    exit 1
fi
echo "✅ .env file exists"

# Check if services are running
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "🔗 Testing Service Endpoints:"

# Test MySQL
if docker compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
    echo "✅ MySQL is healthy"
else
    echo "❌ MySQL is not responding"
fi

# Test Backend
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
fi

# Test Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
fi

# Test OTP Service
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ OTP Service is responding"
else
    echo "⚠️  OTP Service may not be responding (check logs)"
fi

echo ""
echo "📋 View logs with: docker compose logs -f"
echo "🛑 Stop services with: docker compose down"

