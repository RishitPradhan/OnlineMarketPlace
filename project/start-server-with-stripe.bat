@echo off
echo Setting up Stripe environment...
REM Stripe secret key removed for security compliance
REM set STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY_HERE
set PORT=3001
set NODE_ENV=development

echo.
echo Starting Backend Server with Stripe...
echo.
echo Server will be available at: http://localhost:3001
echo Stripe payment features are ENABLED
echo.
echo Press Ctrl+C to stop the server
echo.
node server.cjs 