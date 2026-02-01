# Docker Desktop 자동 다운로드 및 설치 안내 스크립트

$ErrorActionPreference = "Stop"

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
"  Docker Desktop 설치 가이드"
"=" * 80
""

# 1. Docker 설치 여부 확인
Write-Log "Docker 설치 확인 중..." "INFO"

try {
    $dockerVersion = docker --version
    Write-Log "Docker가 이미 설치되어 있습니다: $dockerVersion" "SUCCESS"
    ""
    Write-Log "Docker Desktop이 실행 중인지 확인해주세요!" "INFO"
    Write-Log "  1. 시스템 트레이에서 Docker 아이콘 확인" "INFO"
    Write-Log "  2. Docker Desktop이 실행 중이 아니면 시작" "INFO"
    ""
    Write-Log "Docker가 준비되면 다음 명령어를 실행하세요:" "INFO"
    Write-Log "  .\start-local.ps1" "SUCCESS"
    exit 0
} catch {
    Write-Log "Docker가 설치되어 있지 않습니다" "WARNING"
}

""

# 2. 시스템 요구사항 확인
Write-Log "시스템 요구사항 확인 중..." "INFO"

$osVersion = [System.Environment]::OSVersion.Version
$is64Bit = [System.Environment]::Is64BitOperatingSystem

if (-not $is64Bit) {
    Write-Log "❌ 64비트 운영체제가 필요합니다" "ERROR"
    exit 1
}

Write-Log "✅ 64비트 운영체제 확인" "SUCCESS"

# Windows 10/11 확인
if ($osVersion.Major -ge 10) {
    Write-Log "✅ Windows 버전 확인: Windows $($osVersion.Major)" "SUCCESS"
} else {
    Write-Log "⚠️  Windows 10 이상을 권장합니다" "WARNING"
}

""

# 3. Docker Desktop 다운로드
Write-Log "Docker Desktop 다운로드 준비..." "INFO"
""

$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$downloadPath = "$env:TEMP\DockerDesktopInstaller.exe"

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  Docker Desktop 설치 방법" -ForegroundColor Yellow
Write-Host "=" * 80 -ForegroundColor Cyan
""
Write-Host "옵션 1: 자동 다운로드 및 설치" -ForegroundColor Green
Write-Host "  1. 아래 명령어를 실행하여 자동으로 다운로드합니다" -ForegroundColor White
Write-Host "  2. 다운로드 완료 후 설치 파일을 실행합니다" -ForegroundColor White
""
Write-Host "옵션 2: 수동 다운로드" -ForegroundColor Green
Write-Host "  1. 브라우저에서 다음 URL을 엽니다:" -ForegroundColor White
Write-Host "     https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
Write-Host "  2. 'Download for Windows' 클릭" -ForegroundColor White
Write-Host "  3. 다운로드한 설치 파일 실행" -ForegroundColor White
""
Write-Host "=" * 80 -ForegroundColor Cyan
""

# 사용자 선택
$choice = Read-Host "자동 다운로드를 시작하시겠습니까? (Y/N)"

if ($choice -eq 'Y' -or $choice -eq 'y') {
    Write-Log "Docker Desktop 다운로드 중... (약 500MB)" "INFO"
    Write-Log "다운로드 위치: $downloadPath" "INFO"
    ""

    try {
        # 진행률 표시와 함께 다운로드
        $ProgressPreference = 'Continue'
        Invoke-WebRequest -Uri $dockerUrl -OutFile $downloadPath -UseBasicParsing

        Write-Log "다운로드 완료!" "SUCCESS"
        ""

        # 설치 파일 실행
        Write-Log "Docker Desktop 설치 시작..." "INFO"
        Write-Log "설치 마법사의 안내를 따라주세요" "INFO"
        ""

        Start-Process -FilePath $downloadPath -Wait

        Write-Log "설치가 완료되었습니다!" "SUCCESS"
        ""

    } catch {
        Write-Log "다운로드 실패: $_" "ERROR"
        Write-Log "수동으로 다운로드해주세요: $dockerUrl" "INFO"
        exit 1
    }
} else {
    Write-Log "수동 다운로드를 선택하셨습니다" "INFO"
    Write-Log "다운로드 URL: $dockerUrl" "INFO"
    ""
    Write-Log "다운로드 후 설치 파일을 실행하세요" "INFO"
}

""

# 4. 설치 후 안내
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  Docker Desktop 설치 완료 후 다음 단계" -ForegroundColor Yellow
Write-Host "=" * 80 -ForegroundColor Cyan
""
Write-Host "1. 컴퓨터 재시작 (필요시)" -ForegroundColor White
Write-Host "   - 설치 중 재시작 요청이 있으면 재시작하세요" -ForegroundColor Gray
""
Write-Host "2. Docker Desktop 실행" -ForegroundColor White
Write-Host "   - 시작 메뉴에서 'Docker Desktop' 검색 후 실행" -ForegroundColor Gray
Write-Host "   - 초기 실행 시 약 1-2분 소요" -ForegroundColor Gray
""
Write-Host "3. Docker 설치 확인" -ForegroundColor White
Write-Host "   - PowerShell에서 다음 명령어 실행:" -ForegroundColor Gray
Write-Host "     docker --version" -ForegroundColor Cyan
""
Write-Host "4. MalgnLMS 환경 시작" -ForegroundColor White
Write-Host "   - 다음 명령어로 전체 환경 시작:" -ForegroundColor Gray
Write-Host "     cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean" -ForegroundColor Cyan
Write-Host "     .\start-local.ps1" -ForegroundColor Cyan
""
Write-Host "=" * 80 -ForegroundColor Cyan
""

Write-Log "설치 가이드를 완료했습니다" "SUCCESS"
Write-Log "문제가 발생하면 LOCAL_DEPLOYMENT_GUIDE.md를 참조하세요" "INFO"
