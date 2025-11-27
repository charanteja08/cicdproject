# One-command Docker deployment script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AgriZen Full-Stack Docker Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    powershell -ExecutionPolicy Bypass -File create-env.ps1
}

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
Write-Host "Building Docker images..." -ForegroundColor Cyan
docker compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
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
Write-Host "Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

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
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:    docker compose logs -f" -ForegroundColor White
Write-Host "  Stop:         docker compose down" -ForegroundColor White
Write-Host "  Status:       docker compose ps" -ForegroundColor White
Write-Host "  Verify:       .\verify-deployment.ps1" -ForegroundColor White
Write-Host ""

