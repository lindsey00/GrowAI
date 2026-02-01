# Docker 확인 후 자동 시작 스크립트

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
"  MalgnLMS 환경 준비 상태 확인"
"=" * 80
""

# 1. Docker 설치 확인
Write-Log "1단계: Docker 설치 확인" "INFO"

try {
    $dockerVersion = docker --version
    Write-Log "✅ Docker 설치됨: $dockerVersion" "SUCCESS"
} catch {
    Write-Log "❌ Docker가 설치되어 있지 않습니다" "ERROR"
    ""
    Write-Log "Docker를 설치하려면 다음 명령어를 실행하세요:" "INFO"
    Write-Log "  .\install-docker.ps1" "INFO"
    ""
    exit 1
}

""

# 2. Docker Desktop 실행 확인
Write-Log "2단계: Docker Desktop 실행 확인" "INFO"

try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Desktop이 실행 중이 아닙니다"
    }
    Write-Log "✅ Docker Desktop 실행 중" "SUCCESS"
} catch {
    Write-Log "❌ Docker Desktop이 실행 중이 아닙니다" "ERROR"
    ""
    Write-Log "Docker Desktop을 시작하는 방법:" "INFO"
    Write-Log "  1. 시작 메뉴에서 'Docker Desktop' 검색" "INFO"
    Write-Log "  2. Docker Desktop 실행" "INFO"
    Write-Log "  3. 시스템 트레이에서 Docker 아이콘이 초록색이 될 때까지 대기" "INFO"
    Write-Log "  4. 이 스크립트를 다시 실행" "INFO"
    ""

    # Docker Desktop 자동 시작 시도
    $dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktopPath) {
        $choice = Read-Host "Docker Desktop을 자동으로 시작하시겠습니까? (Y/N)"
        if ($choice -eq 'Y' -or $choice -eq 'y') {
            Write-Log "Docker Desktop 시작 중..." "INFO"
            Start-Process $dockerDesktopPath

            Write-Log "Docker Desktop이 시작될 때까지 대기 중 (최대 60초)..." "INFO"

            $retries = 30
            $retry_count = 0

            while ($retry_count -lt $retries) {
                Start-Sleep -Seconds 2
                try {
                    $dockerInfo = docker info 2>&1
                    if ($LASTEXITCODE -eq 0) {
                        Write-Log "✅ Docker Desktop 준비 완료!" "SUCCESS"
                        break
                    }
                } catch {
                    # Continue waiting
                }
                $retry_count++
                Write-Host -NoNewline "."
            }

            ""

            if ($retry_count -eq $retries) {
                Write-Log "⚠️  Docker Desktop 시작 시간 초과" "WARNING"
                Write-Log "수동으로 Docker Desktop을 시작하고 이 스크립트를 다시 실행하세요" "INFO"
                exit 1
            }
        } else {
            exit 1
        }
    } else {
        exit 1
    }
}

""

# 3. Docker Compose 확인
Write-Log "3단계: Docker Compose 확인" "INFO"

try {
    $composeVersion = docker-compose --version
    Write-Log "✅ Docker Compose 사용 가능: $composeVersion" "SUCCESS"
} catch {
    Write-Log "⚠️  Docker Compose를 찾을 수 없습니다" "WARNING"
    Write-Log "Docker Desktop에 포함되어 있어야 합니다" "INFO"
}

""

# 4. Java 확인
Write-Log "4단계: Java 확인" "INFO"

try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Log "✅ Java 설치됨: $javaVersion" "SUCCESS"
} catch {
    Write-Log "❌ Java가 설치되어 있지 않습니다" "ERROR"
    Write-Log "Java 17 이상이 필요합니다" "INFO"
    exit 1
}

""

# 5. Node.js 확인
Write-Log "5단계: Node.js 확인" "INFO"

try {
    $nodeVersion = node --version
    Write-Log "✅ Node.js 설치됨: $nodeVersion" "SUCCESS"
} catch {
    Write-Log "❌ Node.js가 설치되어 있지 않습니다" "ERROR"
    exit 1
}

""

# 6. 백엔드 JAR 확인
Write-Log "6단계: 백엔드 빌드 확인" "INFO"

$jarPath = "D:\Workspace\GrowAI_LMS\MalgnLMS-clean\polytech-lms-api\build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar"

if (Test-Path $jarPath) {
    $jarSize = (Get-Item $jarPath).Length / 1MB
    Write-Log "✅ 백엔드 JAR 존재: $([math]::Round($jarSize, 2)) MB" "SUCCESS"
} else {
    Write-Log "⚠️  백엔드 JAR가 없습니다 (시작 시 자동 빌드)" "WARNING"
}

""

# 모든 확인 완료
Write-Host "=" * 80 -ForegroundColor Green
Write-Host "  ✅ 모든 준비가 완료되었습니다!" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Green
""

Write-Log "MalgnLMS 로컬 환경을 시작합니다..." "SUCCESS"
""

$choice = Read-Host "지금 시작하시겠습니까? (Y/N)"

if ($choice -eq 'Y' -or $choice -eq 'y') {
    ""
    Write-Log "시작 스크립트 실행 중..." "INFO"
    ""

    # start-local.ps1 실행
    & "D:\Workspace\GrowAI_LMS\MalgnLMS-clean\start-local.ps1"
} else {
    ""
    Write-Log "준비가 완료되었습니다. 다음 명령어로 시작할 수 있습니다:" "INFO"
    Write-Log "  .\start-local.ps1" "INFO"
    ""
}
