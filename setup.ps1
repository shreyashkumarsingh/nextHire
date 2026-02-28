# Automated Setup Script for Resume Screening System
# Windows PowerShell 5.1+

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Resume Screening System - Automated Setup" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Virtual environment
Write-Host "[1/5] Checking Python environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}
& ".\venv\Scripts\Activate.ps1"
Write-Host "Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray
pip install --upgrade pip -q 2>$null
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "Dependency installation had issues" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Create directories
Write-Host "[3/5] Creating required directories..." -ForegroundColor Yellow
$dirs = @("logs", "backups", "uploads/resumes", "uploads/job_descriptions", "instance")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created: $dir" -ForegroundColor Gray
    }
}
Write-Host ""

# Step 4: Setup .env file
Write-Host "[4/5] Setting up environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host "Created .env file" -ForegroundColor Green
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}
Write-Host ""

# Step 5: Initialize database
Write-Host "[5/5] Initializing database..." -ForegroundColor Yellow
python init_db.py init
Write-Host ""

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
Write-Host "2. Run: python app_production.py" -ForegroundColor White
Write-Host "3. Open: http://localhost:5000" -ForegroundColor White
Write-Host ""
