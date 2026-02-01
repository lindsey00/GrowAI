#!/bin/bash
# MalgnLMS 통합 빌드 스크립트
# 생성일: 2026-02-01

set -e  # 오류 발생시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 프로젝트 경로
PROJECT_ROOT="/d/Workspace/GrowAI_LMS/MalgnLMS-clean"
LOG_DIR="/d/Workspace/GrowAI_LMS/logs"
LOG_FILE="$LOG_DIR/MalgnLMS_clean_build_work_$(date +%Y%m%d).log"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# 헤더 출력
echo "================================================================================" | tee "$LOG_FILE"
echo "  MalgnLMS 통합 빌드 및 테스트" | tee -a "$LOG_FILE"
echo "================================================================================" | tee -a "$LOG_FILE"
log_info "빌드 시작 시간: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "프로젝트 루트: $PROJECT_ROOT"
log_info "로그 파일: $LOG_FILE"
echo "================================================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 시작 시간 기록
BUILD_START_TIME=$(date +%s)

# 1. 환경 검증
log_info "1단계: 환경 검증 중..."
echo "" | tee -a "$LOG_FILE"

# Java 버전 확인
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    log_success "Java 설치 확인: $JAVA_VERSION"
else
    log_error "Java가 설치되어 있지 않습니다!"
    exit 1
fi

# Node.js 버전 확인
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js 설치 확인: $NODE_VERSION"
else
    log_error "Node.js가 설치되어 있지 않습니다!"
    exit 1
fi

# npm 버전 확인
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm 설치 확인: v$NPM_VERSION"
else
    log_error "npm이 설치되어 있지 않습니다!"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"
log_success "환경 검증 완료"
echo "" | tee -a "$LOG_FILE"

# 2. 백엔드 빌드 (Spring Boot)
log_info "2단계: 백엔드 (Spring Boot) 빌드 중..."
echo "" | tee -a "$LOG_FILE"

cd "$PROJECT_ROOT/polytech-lms-api"

# Gradle 빌드
log_info "Gradle 빌드 실행 중..."
if ./gradlew clean build --no-daemon 2>&1 | tee -a "$LOG_FILE"; then
    log_success "백엔드 빌드 성공"

    # 빌드 산출물 확인
    if [ -f "build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar" ]; then
        JAR_SIZE=$(du -h build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar | cut -f1)
        log_success "JAR 파일 생성 완료: $JAR_SIZE"
    else
        log_warning "JAR 파일을 찾을 수 없습니다"
    fi
else
    log_error "백엔드 빌드 실패"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

# 3. 백엔드 테스트
log_info "3단계: 백엔드 테스트 실행 중..."
echo "" | tee -a "$LOG_FILE"

if ./gradlew test --no-daemon 2>&1 | tee -a "$LOG_FILE"; then
    log_success "백엔드 테스트 통과"

    # 테스트 결과 확인
    if [ -d "build/test-results/test" ]; then
        TEST_COUNT=$(find build/test-results/test -name "*.xml" | wc -l)
        log_info "테스트 케이스 실행: $TEST_COUNT 개"
    fi
else
    log_warning "백엔드 테스트에서 일부 실패가 발생했습니다 (계속 진행)"
fi

echo "" | tee -a "$LOG_FILE"

# 4. 프론트엔드 빌드 (React + Vite)
log_info "4단계: 프론트엔드 (React) 빌드 중..."
echo "" | tee -a "$LOG_FILE"

cd "$PROJECT_ROOT/project"

# npm 의존성 설치
log_info "npm 의존성 설치 중..."
if npm install 2>&1 | tee -a "$LOG_FILE"; then
    log_success "npm 의존성 설치 완료"
else
    log_error "npm 의존성 설치 실패"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

# Vite 빌드
log_info "Vite 프로덕션 빌드 실행 중..."
if npm run build 2>&1 | tee -a "$LOG_FILE"; then
    log_success "프론트엔드 빌드 성공"

    # 빌드 산출물 확인
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        FILE_COUNT=$(find dist -type f | wc -l)
        log_success "빌드 산출물 생성: $DIST_SIZE ($FILE_COUNT 파일)"
    fi
else
    log_error "프론트엔드 빌드 실패"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

# 5. 빌드 결과 요약
cd "$PROJECT_ROOT"

BUILD_END_TIME=$(date +%s)
BUILD_DURATION=$((BUILD_END_TIME - BUILD_START_TIME))
BUILD_MINUTES=$((BUILD_DURATION / 60))
BUILD_SECONDS=$((BUILD_DURATION % 60))

echo "================================================================================" | tee -a "$LOG_FILE"
log_success "전체 빌드 완료!"
echo "================================================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

log_info "빌드 요약:"
log_info "  - 백엔드 JAR: polytech-lms-api/build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar"
log_info "  - 프론트엔드: project/dist/"
log_info "  - 빌드 시간: ${BUILD_MINUTES}분 ${BUILD_SECONDS}초"
log_info "  - 로그 파일: $LOG_FILE"

echo "" | tee -a "$LOG_FILE"
log_success "배포 준비 완료!"
echo "================================================================================" | tee -a "$LOG_FILE"

exit 0
