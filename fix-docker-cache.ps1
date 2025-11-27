# Fix Docker Build Cache Corruption
# This script resolves the "parent snapshot does not exist" error

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Docker Build Cache Corruption" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Cyan
try {
    docker info | Out-Null
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Stopping and removing containers..." -ForegroundColor Cyan
docker compose down -v 2>$null
Write-Host "Containers stopped" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Removing problematic otp-service image..." -ForegroundColor Cyan
docker rmi cicdproject-otp-service:latest 2>$null
docker rmi otp-service:latest 2>$null
Write-Host "Images removed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Pruning Docker build cache..." -ForegroundColor Cyan
docker builder prune -f
Write-Host "Build cache pruned" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Removing all build cache for this project..." -ForegroundColor Cyan
docker system prune -f --volumes
Write-Host "System cache cleaned" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Rebuilding images with fresh cache..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Build without cache to ensure clean build
docker compose build --no-cache --pull

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Build failed! Check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 6: Starting services..." -ForegroundColor Cyan
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start services!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting for services to initialize (30 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8080/api" -ForegroundColor White
Write-Host "  OTP:       http://localhost:5000/api/admin/otp" -ForegroundColor White
Write-Host ""
Write-Host "Checking service status..." -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:    docker compose logs -f" -ForegroundColor White
Write-Host "  Stop:         docker compose down" -ForegroundColor White
Write-Host "  Restart:      docker compose restart" -ForegroundColor White
Write-Host ""

