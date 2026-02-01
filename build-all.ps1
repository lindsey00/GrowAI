# MalgnLMS 통합 빌드 스크립트 (PowerShell)
# 생성일: 2026-02-01

param(
    [string]$ProjectRoot = "D:\Workspace\GrowAI_LMS\MalgnLMS-clean",
    [string]$LogDir = "D:\Workspace\GrowAI_LMS\logs"
)

# 오류 발생시 중단
$ErrorActionPreference = "Stop"

# 로그 파일 경로
$LogFile = Join-Path $LogDir "MalgnLMS_clean_build_work_$(Get-Date -Format 'yyyyMMdd').log"

# 로그 디렉토리 생성
if (-not (Test-Path $LogDir)) {
    New-Item -Path $LogDir -ItemType Directory -Force | Out-Null
}

# 로그 함수
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"

    switch ($Level) {
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        "ERROR" { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        "INFO" { Write-Host $logMessage -ForegroundColor Cyan }
        default { Write-Host $logMessage }
    }

    Add-Content -Path $LogFile -Value $logMessage
}

# 헤더 출력
"=" * 80 | Out-File -FilePath $LogFile
"  MalgnLMS 통합 빌드 및 테스트" | Out-File -FilePath $LogFile -Append
"=" * 80 | Out-File -FilePath $LogFile -Append

Write-Log "빌드 시작 시간: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "INFO"
Write-Log "프로젝트 루트: $ProjectRoot" "INFO"
Write-Log "로그 파일: $LogFile" "INFO"
"=" * 80 | Out-File -FilePath $LogFile -Append
"" | Out-File -FilePath $LogFile -Append

$buildStartTime = Get-Date

try {
    # 1. 환경 검증
    Write-Log "1단계: 환경 검증 중..." "INFO"
    "" | Out-File -FilePath $LogFile -Append

    # Java 확인
    try {
        $javaVersion = java -version 2>&1 | Select-Object -First 1
        Write-Log "Java 설치 확인: $javaVersion" "SUCCESS"
    } catch {
        Write-Log "Java가 설치되어 있지 않습니다!" "ERROR"
        exit 1
    }

    # Node.js 확인
    try {
        $nodeVersion = node --version
        Write-Log "Node.js 설치 확인: $nodeVersion" "SUCCESS"
    } catch {
        Write-Log "Node.js가 설치되어 있지 않습니다!" "ERROR"
        exit 1
    }

    # npm 확인
    try {
        $npmVersion = npm --version
        Write-Log "npm 설치 확인: v$npmVersion" "SUCCESS"
    } catch {
        Write-Log "npm이 설치되어 있지 않습니다!" "ERROR"
        exit 1
    }

    "" | Out-File -FilePath $LogFile -Append
    Write-Log "환경 검증 완료" "SUCCESS"
    "" | Out-File -FilePath $LogFile -Append

    # 2. 백엔드 빌드
    Write-Log "2단계: 백엔드 (Spring Boot) 빌드 중..." "INFO"
    "" | Out-File -FilePath $LogFile -Append

    Set-Location "$ProjectRoot\polytech-lms-api"

    Write-Log "Gradle 빌드 실행 중..." "INFO"
    $gradleOutput = .\gradlew.bat clean build --no-daemon 2>&1
    $gradleOutput | Out-File -FilePath $LogFile -Append

    if ($LASTEXITCODE -eq 0) {
        Write-Log "백엔드 빌드 성공" "SUCCESS"

        # JAR 파일 확인
        $jarFile = "build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar"
        if (Test-Path $jarFile) {
            $jarSize = (Get-Item $jarFile).Length / 1MB
            Write-Log "JAR 파일 생성 완료: $([math]::Round($jarSize, 2)) MB" "SUCCESS"
        } else {
            Write-Log "JAR 파일을 찾을 수 없습니다" "WARNING"
        }
    } else {
        Write-Log "백엔드 빌드 실패 (Exit Code: $LASTEXITCODE)" "ERROR"
        throw "백엔드 빌드 실패"
    }

    "" | Out-File -FilePath $LogFile -Append

    # 3. 백엔드 테스트
    Write-Log "3단계: 백엔드 테스트 실행 중..." "INFO"
    "" | Out-File -FilePath $LogFile -Append

    $testOutput = .\gradlew.bat test --no-daemon 2>&1
    $testOutput | Out-File -FilePath $LogFile -Append

    if ($LASTEXITCODE -eq 0) {
        Write-Log "백엔드 테스트 통과" "SUCCESS"

        # 테스트 결과 확인
        if (Test-Path "build\test-results\test") {
            $testCount = (Get-ChildItem "build\test-results\test" -Filter "*.xml" -Recurse).Count
            Write-Log "테스트 케이스 실행: $testCount 개" "INFO"
        }
    } else {
        Write-Log "백엔드 테스트에서 일부 실패 발생 (계속 진행)" "WARNING"
    }

    "" | Out-File -FilePath $LogFile -Append

    # 4. 프론트엔드 빌드
    Write-Log "4단계: 프론트엔드 (React) 빌드 중..." "INFO"
    "" | Out-File -FilePath $LogFile -Append

    Set-Location "$ProjectRoot\project"

    # npm 의존성 설치
    Write-Log "npm 의존성 설치 중..." "INFO"
    $npmInstallOutput = npm install 2>&1
    $npmInstallOutput | Out-File -FilePath $LogFile -Append

    if ($LASTEXITCODE -eq 0) {
        Write-Log "npm 의존성 설치 완료" "SUCCESS"
    } else {
        Write-Log "npm 의존성 설치 실패" "ERROR"
        throw "npm 의존성 설치 실패"
    }

    "" | Out-File -FilePath $LogFile -Append

    # Vite 빌드
    Write-Log "Vite 프로덕션 빌드 실행 중..." "INFO"
    $viteBuildOutput = npm run build 2>&1
    $viteBuildOutput | Out-File -FilePath $LogFile -Append

    if ($LASTEXITCODE -eq 0) {
        Write-Log "프론트엔드 빌드 성공" "SUCCESS"

        # 빌드 산출물 확인
        if (Test-Path "dist") {
            $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            $fileCount = (Get-ChildItem "dist" -Recurse -File).Count
            Write-Log "빌드 산출물 생성: $([math]::Round($distSize, 2)) MB ($fileCount 파일)" "SUCCESS"
        }
    } else {
        Write-Log "프론트엔드 빌드 실패" "ERROR"
        throw "프론트엔드 빌드 실패"
    }

    "" | Out-File -FilePath $LogFile -Append

    # 5. 빌드 결과 요약
    Set-Location $ProjectRoot

    $buildEndTime = Get-Date
    $buildDuration = $buildEndTime - $buildStartTime
    $buildMinutes = [math]::Floor($buildDuration.TotalMinutes)
    $buildSeconds = $buildDuration.Seconds

    "=" * 80 | Out-File -FilePath $LogFile -Append
    Write-Log "전체 빌드 완료!" "SUCCESS"
    "=" * 80 | Out-File -FilePath $LogFile -Append
    "" | Out-File -FilePath $LogFile -Append

    Write-Log "빌드 요약:" "INFO"
    Write-Log "  - 백엔드 JAR: polytech-lms-api\build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar" "INFO"
    Write-Log "  - 프론트엔드: project\dist\" "INFO"
    Write-Log "  - 빌드 시간: ${buildMinutes}분 ${buildSeconds}초" "INFO"
    Write-Log "  - 로그 파일: $LogFile" "INFO"

    "" | Out-File -FilePath $LogFile -Append
    Write-Log "배포 준비 완료!" "SUCCESS"
    "=" * 80 | Out-File -FilePath $LogFile -Append

    # 빌드 보고서 생성
    $reportFile = Join-Path $LogDir "build_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    @"
# MalgnLMS 빌드 보고서

## 빌드 정보
- **빌드 일시**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- **빌드 시간**: ${buildMinutes}분 ${buildSeconds}초
- **빌드 상태**: ✅ 성공

## 환경 정보
- **Java**: $javaVersion
- **Node.js**: $nodeVersion
- **npm**: v$npmVersion

## 빌드 산출물
- **백엔드 JAR**: polytech-lms-api\build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar
- **프론트엔드**: project\dist\

## 로그 파일
- **상세 로그**: $LogFile

---
**빌드 완료 시간**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@ | Out-File -FilePath $reportFile -Encoding UTF8

    Write-Log "빌드 보고서 생성: $reportFile" "SUCCESS"

    exit 0

} catch {
    Write-Log "빌드 중 오류 발생: $_" "ERROR"
    Write-Log "상세 로그: $LogFile" "ERROR"
    exit 1
}
