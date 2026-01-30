# QueueOne UAT Environment Startup Script
# This script starts the complete UAT environment with proper health checks

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "QueueOne UAT Environment Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
$dockerCheck = docker ps 2>$null
if (-not $?) {
    Write-Host "ERROR: Docker is not running or not installed!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop or install Docker." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Get project root
$projectRoot = Split-Path -Parent $PSScriptRoot
Write-Host "Project Root: $projectRoot" -ForegroundColor Cyan

# Change to project directory
Set-Location $projectRoot

# Stop existing containers if running
Write-Host "Stopping existing UAT containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.uat.yml down --remove-orphans 2>$null
Write-Host "✓ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "Starting UAT services..." -ForegroundColor Yellow
docker-compose -f docker-compose.uat.yml up -d

# Wait for services to be healthy
Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $status = docker-compose -f docker-compose.uat.yml ps --services --status running
    $runningServices = @($status | Measure-Object -Line).Lines
    
    if ($runningServices -ge 6) {
        Write-Host "✓ All services are running" -ForegroundColor Green
        break
    }
    
    Write-Host "  Services running: $runningServices/6" -ForegroundColor Gray
    Start-Sleep -Seconds 2
    $attempt++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "UAT Environment is Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Display service URLs
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  Frontend:           http://localhost:3002" -ForegroundColor Yellow
Write-Host "  Admin Panel:        http://localhost:3003" -ForegroundColor Yellow
Write-Host "  Backend API:        http://localhost:4001" -ForegroundColor Yellow
Write-Host "  Notification Svc:   http://localhost:5002" -ForegroundColor Yellow
Write-Host ""

# Display database credentials
Write-Host "Database Access:" -ForegroundColor Cyan
Write-Host "  PostgreSQL Host:    localhost:5433" -ForegroundColor Yellow
Write-Host "  Database:           queueone_uat" -ForegroundColor Yellow
Write-Host "  Username:           queueone_uat" -ForegroundColor Yellow
Write-Host "  Redis Host:         localhost:6380" -ForegroundColor Yellow
Write-Host ""

# Show next steps
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3002 in your browser" -ForegroundColor Yellow
Write-Host "  2. View logs:  docker-compose -f docker-compose.uat.yml logs -f" -ForegroundColor Yellow
Write-Host "  3. Stop:       docker-compose -f docker-compose.uat.yml down" -ForegroundColor Yellow
Write-Host "  4. Read:       UAT_SETUP.md for detailed testing guidelines" -ForegroundColor Yellow
Write-Host ""

# Show running containers
Write-Host "Running Containers:" -ForegroundColor Cyan
docker-compose -f docker-compose.uat.yml ps

Write-Host ""
Write-Host "Ready for testing!" -ForegroundColor Green
