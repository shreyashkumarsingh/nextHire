# NextHire Startup Script
# This script starts both the backend and frontend servers

Write-Host "
╔══════════════════════════════════════════╗
║       NextHire - AI Resume Parser       ║
║           Starting Application...        ║
╚══════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "⚠️  Virtual environment not found!" -ForegroundColor Yellow
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "⚠️  Node modules not found!" -ForegroundColor Yellow
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
}

Write-Host "`n🚀 Starting NextHire..." -ForegroundColor Cyan

# Start backend in new window
Write-Host "`n📦 Starting Flask Backend (Production, Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Write-Host '╔══════════════════════════════════════╗' -ForegroundColor Blue;
    Write-Host '║     NextHire Backend (Production)    ║' -ForegroundColor Blue;
    Write-Host '║     Running on Port 5000             ║' -ForegroundColor Blue;
    Write-Host '╚══════════════════════════════════════╝' -ForegroundColor Blue;
    & '.\venv\Scripts\Activate.ps1';
    python app_production.py
"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "⚛️  Starting React Frontend (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Write-Host '╔══════════════════════════════════════╗' -ForegroundColor Green;
    Write-Host '║     NextHire Frontend Server         ║' -ForegroundColor Green;
    Write-Host '║     Running on Port 3000             ║' -ForegroundColor Green;
    Write-Host '╚══════════════════════════════════════╝' -ForegroundColor Green;
    Set-Location frontend;
    npm run dev
"

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host "
╔══════════════════════════════════════════╗
║          ✅ NextHire is Ready!          ║
╚══════════════════════════════════════════╝

📱 Frontend: http://localhost:3000
🔧 Backend:  http://localhost:5000

💡 Tips:
   - Press Ctrl+C in each window to stop servers
   - Frontend auto-refreshes on code changes
   - Backend requires restart for changes

🎉 Happy hiring with NextHire!
" -ForegroundColor Cyan

# Open browser
Start-Sleep -Seconds 3
Write-Host "🌐 Opening browser..." -ForegroundColor Magenta
Start-Process "http://localhost:3000"

Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
