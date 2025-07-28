@echo off
echo Setting up Stripe environment...
set STRIPE_SECRET_KEY=REMOVED
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