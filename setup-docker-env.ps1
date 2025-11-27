# PowerShell script to set up .env file for Docker deployment
# This script configures your environment with your actual credentials

Write-Host "🔧 Setting up Docker environment file..." -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

# Check if .env already exists
if (Test-Path $envFile) {
    $overwrite = Read-Host ".env file already exists. Overwrite? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled. Using existing .env file." -ForegroundColor Yellow
        exit 0
    }
}

# Generate a secure JWT secret
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Your actual credentials
$gmailUser = "pandu31417@gmail.com"
$gmailAppPassword = "uhkl cvxa alpe scvh"
$allowedAdminEmail = "pandu31417@gmail.com"

# MySQL credentials (you can change these)
$mysqlRootPassword = "AgrizenRoot2025!"
$mysqlPassword = "AgrizenDB2025!"

Write-Host "📝 Creating .env file with your credentials..." -ForegroundColor Green

$envContent = @"
# MySQL Configuration
MYSQL_ROOT_PASSWORD=$mysqlRootPassword
MYSQL_DATABASE=agrigrow
MYSQL_USER=agrizen
MYSQL_PASSWORD=$mysqlPassword
MYSQL_PORT=3306

# Email Configuration (for Spring Boot)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=$gmailUser
MAIL_PASSWORD=$gmailAppPassword

# OTP Service Configuration
GMAIL_USER=$gmailUser
GMAIL_APP_PASSWORD=$gmailAppPassword
ALLOWED_ADMIN_EMAIL=$allowedAdminEmail
OTP_EXPIRY_MS=300000
JWT_SECRET=$jwtSecret

# Frontend Configuration
FRONTEND_ORIGIN=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ADMIN_OTP_API=http://localhost:5000/api/admin/otp

# Port Configuration
FRONTEND_PORT=3000
BACKEND_PORT=8080
OTP_PORT=5000

# Twilio (optional - leave empty if not using SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
"@

$envContent | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configured values:" -ForegroundColor Cyan
Write-Host "   - Gmail User: $gmailUser" -ForegroundColor White
Write-Host "   - Admin Email: $allowedAdminEmail" -ForegroundColor White
Write-Host "   - MySQL Root Password: $mysqlRootPassword" -ForegroundColor White
Write-Host "   - MySQL User Password: $mysqlPassword" -ForegroundColor White
Write-Host "   - JWT Secret: Generated [64 characters]" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Review the .env file if you want to change any passwords" -ForegroundColor White
Write-Host "   2. Run: docker compose up -d --build" -ForegroundColor White
Write-Host "   3. Verify: .\verify-deployment.ps1" -ForegroundColor White
Write-Host ""

