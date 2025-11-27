# Simple script to create .env file with your credentials

$gmailUser = "pandu31417@gmail.com"
$gmailAppPassword = "uhkl cvxa alpe scvh"
$allowedAdminEmail = "pandu31417@gmail.com"
$mysqlRootPassword = "AgrizenRoot2025!"
$mysqlPassword = "AgrizenDB2025!"

# Generate JWT secret
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

$content = @"
MYSQL_ROOT_PASSWORD=$mysqlRootPassword
MYSQL_DATABASE=agrigrow
MYSQL_USER=agrizen
MYSQL_PASSWORD=$mysqlPassword
MYSQL_PORT=3306
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=$gmailUser
MAIL_PASSWORD=$gmailAppPassword
GMAIL_USER=$gmailUser
GMAIL_APP_PASSWORD=$gmailAppPassword
ALLOWED_ADMIN_EMAIL=$allowedAdminEmail
OTP_EXPIRY_MS=300000
JWT_SECRET=$jwtSecret
FRONTEND_ORIGIN=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ADMIN_OTP_API=http://localhost:5000/api/admin/otp
FRONTEND_PORT=3000
BACKEND_PORT=8080
OTP_PORT=5000
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
"@

$content | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host ".env file created successfully!" -ForegroundColor Green

