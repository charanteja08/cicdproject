# PowerShell script to verify Docker deployment

Write-Host "🔍 Verifying Docker Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Copy from deploy/docker.env.example" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ .env file exists" -ForegroundColor Green

# Check if services are running
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "🔗 Testing Service Endpoints:" -ForegroundColor Cyan

# Test MySQL
try {
    docker compose exec -T mysql mysqladmin ping -h localhost 2>$null | Out-Null
    Write-Host "✅ MySQL is healthy" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL is not responding" -ForegroundColor Red
}

# Test Backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}

# Test Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
}

# Test OTP Service
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
        Write-Host "✅ OTP Service is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  OTP Service may not be responding (check logs)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 View logs with: docker compose logs -f" -ForegroundColor Cyan
Write-Host "🛑 Stop services with: docker compose down" -ForegroundColor Cyan

