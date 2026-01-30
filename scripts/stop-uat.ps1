# QueueOne UAT Environment Cleanup Script
# This script stops and cleans up the UAT environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "QueueOne UAT Environment Shutdown" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get project root
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Ask user if they want to keep data
Write-Host "Do you want to keep the test data? (y/n)" -ForegroundColor Yellow
$keepData = Read-Host

$deleteVolumes = $keepData -ne "y" -and $keepData -ne "Y"

if ($deleteVolumes) {
    Write-Host "Stopping services and removing volumes..." -ForegroundColor Yellow
    docker-compose -f docker-compose.uat.yml down -v
    Write-Host "✓ Services stopped and test data removed" -ForegroundColor Green
} else {
    Write-Host "Stopping services (keeping test data)..." -ForegroundColor Yellow
    docker-compose -f docker-compose.uat.yml down
    Write-Host "✓ Services stopped (test data preserved)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "UAT Environment Shutdown Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
