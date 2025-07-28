Write-Host "Setting up Stripe environment..." -ForegroundColor Green
# Stripe secret key removed for security compliance
# $env:STRIPE_SECRET_KEY = "sk_test_..." (REMOVED)
$env:PORT="3001"
$env:NODE_ENV="development"

Write-Host "Starting Backend Server with Stripe..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Stripe payment features are ENABLED" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

node server.cjs 