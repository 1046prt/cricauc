# CricAuc Setup Script for Windows
Write-Host "🚀 Setting up CricAuc..." -ForegroundColor Cyan

# Check if .env files exist, create if not
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env..." -ForegroundColor Yellow
    Copy-Item "backend\env.template" "backend\.env"
    Write-Host "✅ Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "✅ backend/.env already exists" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "Creating frontend/.env.local..." -ForegroundColor Yellow
    Copy-Item "frontend\env.template" "frontend\.env.local"
    Write-Host "✅ Created frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "✅ frontend/.env.local already exists" -ForegroundColor Green
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Start Docker: npm run docker:up" -ForegroundColor White
Write-Host "2. Create admin: cd backend && npm run create-admin" -ForegroundColor White
Write-Host "3. Start dev: npm run dev" -ForegroundColor White



