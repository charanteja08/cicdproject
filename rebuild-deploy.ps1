# Rebuild and deploy script - fixes build cache issues

Write-Host "🧹 Cleaning Docker build cache..." -ForegroundColor Cyan
docker builder prune -f

Write-Host ""
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Cyan
docker compose down

Write-Host ""
Write-Host "🔨 Rebuilding all images (no cache)..." -ForegroundColor Cyan
docker compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting all services..." -ForegroundColor Cyan
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Failed to start services!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  🔧 Backend:   http://localhost:8080/api" -ForegroundColor White
Write-Host "  📧 OTP:       http://localhost:5000/api/admin/otp" -ForegroundColor White
Write-Host ""
Write-Host "View logs: docker compose logs -f" -ForegroundColor Yellow
Write-Host ""

