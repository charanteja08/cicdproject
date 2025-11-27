# Fixed deployment script that handles package-lock.json issues

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AgriZen Docker Deployment (Fixed)" -ForegroundColor Cyan
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

# Clean up any existing containers
Write-Host ""
Write-Host "Cleaning up old containers..." -ForegroundColor Cyan
docker compose down -v 2>$null

# Remove old package-lock.json if it exists
Write-Host "Preparing Frontend for build..." -ForegroundColor Cyan
if (Test-Path "Frontend\package-lock.json") {
    Remove-Item "Frontend\package-lock.json" -Force
    Write-Host "Removed old package-lock.json" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Building Docker images (this may take a few minutes)..." -ForegroundColor Cyan
Write-Host ""

# Build with no cache to ensure fresh build
docker compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Build failed! Check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting all services..." -ForegroundColor Cyan
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
Write-Host "  Deployment Complete!" -ForegroundColor Green
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
Write-Host "  Verify:       .\verify-deployment.ps1" -ForegroundColor White
Write-Host ""

