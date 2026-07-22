@echo off
echo Starting Smart Bus AI development environment...
echo.

echo [1/3] Starting API Gateway on port 3001...
cd services/api
start "API Gateway" cmd /k "npm run dev"
cd ..

echo [2/3] Starting Simulator...
cd services/simulator
start "Simulator" cmd /k "npm run dev"
cd ..

echo [3/3] Starting Passenger App on port 3000...
cd apps/passenger
start "Passenger App" cmd /k "npm run dev"
cd ..

echo.
echo All services starting...
Pause