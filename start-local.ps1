# MalgnLMS 로컬 개발 환경 시작 스크립트 (PowerShell)
# MySQL + Qdrant + Backend + Frontend 통합 실행

param(
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

# 경로 설정
$ProjectRoot = "D:\Workspace\GrowAI_LMS\MalgnLMS-clean"
$LogDir = "D:\Workspace\GrowAI_LMS\logs"

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
"  MalgnLMS 로컬 개발 환경 시작"
"=" * 80
Write-Log "시작 시간: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "INFO"
"=" * 80
""

Set-Location $ProjectRoot

# 1. Docker 확인
Write-Log "1단계: Docker 확인" "INFO"
""

try {
    $dockerVersion = docker --version
    Write-Log "Docker 버전: $dockerVersion" "SUCCESS"
} catch {
    Write-Log "Docker가 설치되어 있지 않습니다!" "ERROR"
    Write-Log "Docker Desktop을 설치해주세요: https://www.docker.com/products/docker-desktop" "INFO"
    exit 1
}

""

# 2. Docker Compose로 서비스 시작
Write-Log "2단계: Docker 서비스 시작 (MySQL + Qdrant)" "INFO"
""

Write-Log "Docker Compose로 서비스 시작 중..." "INFO"
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Log "Docker Compose 시작 실패" "ERROR"
    exit 1
}

Start-Sleep -Seconds 5
Write-Log "Docker 서비스 상태:" "INFO"
docker-compose ps

""

# 3. MySQL 연결 대기
Write-Log "3단계: MySQL 연결 대기 중..." "INFO"

$retries = 30
$retry_count = 0

while ($retry_count -lt $retries) {
    try {
        $result = docker exec malgnlms-mysql mysqladmin ping -h localhost -u root -proot --silent 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "MySQL 준비 완료!" "SUCCESS"
            break
        }
    } catch {
        # Continue waiting
    }

    $retry_count++
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
}

""

if ($retry_count -eq $retries) {
    Write-Log "MySQL 시작 실패 (타임아웃)" "ERROR"
    docker-compose logs mysql
    exit 1
}

""

# 4. Qdrant 연결 대기
Write-Log "4단계: Qdrant 연결 대기 중..." "INFO"

$retries = 30
$retry_count = 0

while ($retry_count -lt $retries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:6333/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Log "Qdrant 준비 완료!" "SUCCESS"
            break
        }
    } catch {
        # Continue waiting
    }

    $retry_count++
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
}

""

if ($retry_count -eq $retries) {
    Write-Log "Qdrant 시작 실패 (타임아웃)" "ERROR"
    docker-compose logs qdrant
    exit 1
}

""

# 5. 백엔드 빌드 (선택적)
if (-not $SkipBuild) {
    Write-Log "5단계: 백엔드 빌드 확인" "INFO"
    Set-Location "$ProjectRoot\polytech-lms-api"

    $jarFile = "build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar"

    if (-not (Test-Path $jarFile)) {
        Write-Log "JAR 파일이 없습니다. 빌드를 시작합니다..." "INFO"
        .\gradlew.bat clean bootJar -x test --no-daemon

        if ($LASTEXITCODE -ne 0) {
            Write-Log "백엔드 빌드 실패" "ERROR"
            exit 1
        }
        Write-Log "백엔드 빌드 완료" "SUCCESS"
    } else {
        Write-Log "기존 JAR 파일 사용" "SUCCESS"
    }
} else {
    Write-Log "5단계: 빌드 건너뛰기 (-SkipBuild)" "INFO"
    Set-Location "$ProjectRoot\polytech-lms-api"
}

""

# 6. 백엔드 서버 시작
Write-Log "6단계: 백엔드 서버 시작 중..." "INFO"

# 기존 프로세스 확인 및 종료
$backendProcess = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

if ($backendProcess) {
    Write-Log "기존 백엔드 프로세스 종료 (PID: $backendProcess)" "INFO"
    Stop-Process -Id $backendProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 로그 디렉토리 생성
if (-not (Test-Path $LogDir)) {
    New-Item -Path $LogDir -ItemType Directory -Force | Out-Null
}

# 백엔드 시작
$backendLog = Join-Path $LogDir "backend_$(Get-Date -Format 'yyyyMMdd').log"

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "java"
$processInfo.Arguments = "-jar -Dspring.profiles.active=local build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar"
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true
$processInfo.WorkingDirectory = "$ProjectRoot\polytech-lms-api"

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

# 로그 파일 스트림
$outputFile = [System.IO.File]::Create($backendLog)
$outputWriter = New-Object System.IO.StreamWriter($outputFile)

$process.add_OutputDataReceived({
    param($sender, $e)
    if ($e.Data) {
        $outputWriter.WriteLine($e.Data)
        $outputWriter.Flush()
    }
})

$process.add_ErrorDataReceived({
    param($sender, $e)
    if ($e.Data) {
        $outputWriter.WriteLine($e.Data)
        $outputWriter.Flush()
    }
})

$process.Start() | Out-Null
$process.BeginOutputReadLine()
$process.BeginErrorReadLine()

$backendPid = $process.Id
$backendPid | Out-File -FilePath (Join-Path $LogDir "backend.pid") -Encoding ASCII

Write-Log "백엔드 PID: $backendPid" "INFO"

# 백엔드 시작 대기
Write-Log "백엔드 서버 시작 대기 중..." "INFO"

$retries = 60
$retry_count = 0

while ($retry_count -lt $retries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Log "백엔드 서버 시작 완료!" "SUCCESS"
            break
        }
    } catch {
        # Continue waiting
    }

    $retry_count++
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
}

""

if ($retry_count -eq $retries) {
    Write-Log "백엔드 서버 시작 실패 (타임아웃)" "ERROR"
    Write-Log "로그 확인: $backendLog" "INFO"
    Get-Content $backendLog -Tail 50
    exit 1
}

# 헬스 체크
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8081/actuator/health" -UseBasicParsing
    if ($healthResponse.status -eq "UP") {
        Write-Log "백엔드 헬스 체크 통과" "SUCCESS"
    } else {
        Write-Log "백엔드 헬스 체크 경고" "WARNING"
        Write-Host $healthResponse
    }
} catch {
    Write-Log "백엔드 헬스 체크 실패" "WARNING"
}

""

# 7. 프론트엔드 서버 시작
Write-Log "7단계: 프론트엔드 서버 시작 중..." "INFO"
Set-Location "$ProjectRoot\project"

# 프론트엔드 빌드 확인
if (-not (Test-Path "..\public_html\tutor_lms\app")) {
    Write-Log "프론트엔드 빌드가 없습니다. 빌드를 시작합니다..." "INFO"
    npm install
    npm run build
}

# 기존 프로세스 확인 및 종료
$frontendProcess = Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

if ($frontendProcess) {
    Write-Log "기존 프론트엔드 프로세스 종료 (PID: $frontendProcess)" "INFO"
    Stop-Process -Id $frontendProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 프론트엔드 시작
$frontendLog = Join-Path $LogDir "frontend_$(Get-Date -Format 'yyyyMMdd').log"

$frontendProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
$frontendProcessInfo.FileName = "npm"
$frontendProcessInfo.Arguments = "run preview"
$frontendProcessInfo.RedirectStandardOutput = $true
$frontendProcessInfo.RedirectStandardError = $true
$frontendProcessInfo.UseShellExecute = $false
$frontendProcessInfo.CreateNoWindow = $true
$frontendProcessInfo.WorkingDirectory = "$ProjectRoot\project"

$frontendProc = New-Object System.Diagnostics.Process
$frontendProc.StartInfo = $frontendProcessInfo
$frontendProc.Start() | Out-Null

$frontendPid = $frontendProc.Id
$frontendPid | Out-File -FilePath (Join-Path $LogDir "frontend.pid") -Encoding ASCII

Write-Log "프론트엔드 PID: $frontendPid" "INFO"

# 프론트엔드 시작 대기
Write-Log "프론트엔드 서버 시작 대기 중..." "INFO"

$retries = 30
$retry_count = 0

while ($retry_count -lt $retries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4173" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Log "프론트엔드 서버 시작 완료!" "SUCCESS"
            break
        }
    } catch {
        # Continue waiting
    }

    $retry_count++
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
}

""

if ($retry_count -eq $retries) {
    Write-Log "프론트엔드 서버 시작 실패 (타임아웃)" "ERROR"
    Write-Log "로그 확인: $frontendLog" "INFO"
    exit 1
}

""

# 완료 메시지
"=" * 80
Write-Log "MalgnLMS 로컬 개발 환경 시작 완료!" "SUCCESS"
"=" * 80
""
Write-Log "🌐 접속 정보:" "INFO"
Write-Log "  - 프론트엔드:     http://localhost:4173" "INFO"
Write-Log "  - 백엔드 API:     http://localhost:8081" "INFO"
Write-Log "  - 백엔드 Health:  http://localhost:8081/actuator/health" "INFO"
Write-Log "  - MySQL:          localhost:3306 (lmsuser/lmspassword)" "INFO"
Write-Log "  - Qdrant:         http://localhost:6333" "INFO"
Write-Log "  - Qdrant UI:      http://localhost:6333/dashboard" "INFO"
""
Write-Log "📝 로그 파일:" "INFO"
Write-Log "  - 백엔드:   $backendLog" "INFO"
Write-Log "  - 프론트엔드: $frontendLog" "INFO"
""
Write-Log "🔧 프로세스 정보:" "INFO"
Write-Log "  - 백엔드 PID:     $backendPid" "INFO"
Write-Log "  - 프론트엔드 PID: $frontendPid" "INFO"
""
Write-Log "⏹️  서버 종료 방법:" "INFO"
Write-Log "  .\stop-local.ps1" "INFO"
""
"=" * 80
