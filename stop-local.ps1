# MalgnLMS 로컬 개발 환경 종료 스크립트 (PowerShell)

$ErrorActionPreference = "Continue"

$LogDir = "D:\Workspace\GrowAI_LMS\logs"
$ProjectRoot = "D:\Workspace\GrowAI_LMS\MalgnLMS-clean"

# 로그 함수
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    switch ($Level) {
        "SUCCESS" { Write-Host "[$timestamp] ✅ $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "[$timestamp] ❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$timestamp] ⚠️  $Message" -ForegroundColor Yellow }
        "INFO" { Write-Host "[$timestamp] ℹ️  $Message" -ForegroundColor Cyan }
        default { Write-Host "[$timestamp] $Message" }
    }
}

"=" * 80
"  MalgnLMS 로컬 개발 환경 종료"
"=" * 80
""

# 1. 백엔드 종료
Write-Log "백엔드 서버 종료 중..." "INFO"

$backendPidFile = Join-Path $LogDir "backend.pid"

if (Test-Path $backendPidFile) {
    $backendPid = Get-Content $backendPidFile
    try {
        $process = Get-Process -Id $backendPid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $backendPid -Force
            Write-Log "백엔드 서버 종료 완료 (PID: $backendPid)" "SUCCESS"
        } else {
            Write-Log "백엔드 서버가 실행 중이 아닙니다" "INFO"
        }
    } catch {
        Write-Log "백엔드 프로세스 종료 중 오류: $_" "WARNING"
    }
    Remove-Item $backendPidFile -Force -ErrorAction SilentlyContinue
} else {
    # PID 파일이 없으면 포트로 찾기
    try {
        $backendProcess = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique

        if ($backendProcess) {
            Stop-Process -Id $backendProcess -Force
            Write-Log "포트 8081 프로세스 종료 완료 (PID: $backendProcess)" "SUCCESS"
        } else {
            Write-Log "백엔드 서버가 실행 중이 아닙니다" "INFO"
        }
    } catch {
        Write-Log "백엔드 서버가 실행 중이 아닙니다" "INFO"
    }
}

""

# 2. 프론트엔드 종료
Write-Log "프론트엔드 서버 종료 중..." "INFO"

$frontendPidFile = Join-Path $LogDir "frontend.pid"

if (Test-Path $frontendPidFile) {
    $frontendPid = Get-Content $frontendPidFile
    try {
        $process = Get-Process -Id $frontendPid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $frontendPid -Force
            Write-Log "프론트엔드 서버 종료 완료 (PID: $frontendPid)" "SUCCESS"
        } else {
            Write-Log "프론트엔드 서버가 실행 중이 아닙니다" "INFO"
        }
    } catch {
        Write-Log "프론트엔드 프로세스 종료 중 오류: $_" "WARNING"
    }
    Remove-Item $frontendPidFile -Force -ErrorAction SilentlyContinue
} else {
    # PID 파일이 없으면 포트로 찾기
    try {
        $frontendProcess = Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique

        if ($frontendProcess) {
            Stop-Process -Id $frontendProcess -Force
            Write-Log "포트 4173 프로세스 종료 완료 (PID: $frontendProcess)" "SUCCESS"
        } else {
            Write-Log "프론트엔드 서버가 실행 중이 아닙니다" "INFO"
        }
    } catch {
        Write-Log "프론트엔드 서버가 실행 중이 아닙니다" "INFO"
    }
}

""

# 3. Docker 서비스 종료
Write-Log "Docker 서비스 종료 중 (MySQL + Qdrant)..." "INFO"
Set-Location $ProjectRoot

try {
    $runningContainers = docker-compose ps --services --filter "status=running" 2>$null

    if ($runningContainers) {
        docker-compose down
        Write-Log "Docker 서비스 종료 완료" "SUCCESS"
    } else {
        Write-Log "Docker 서비스가 실행 중이 아닙니다" "INFO"
    }
} catch {
    Write-Log "Docker 서비스가 실행 중이 아닙니다" "INFO"
}

""
"=" * 80
Write-Log "모든 서비스가 종료되었습니다" "SUCCESS"
"=" * 80
""
Write-Log "데이터 유지: MySQL 및 Qdrant 데이터는 Docker 볼륨에 보존됩니다" "INFO"
Write-Log "데이터 삭제: docker-compose down -v (볼륨 포함 삭제)" "INFO"
""
