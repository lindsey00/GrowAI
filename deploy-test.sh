#!/bin/bash
# 로컬 배포 테스트 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 로그 파일
LOG_DIR="/d/Workspace/GrowAI_LMS/logs"
TEST_LOG="$LOG_DIR/deployment_test_$(date +%Y%m%d_%H%M%S).log"

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$TEST_LOG"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$TEST_LOG"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$TEST_LOG"
}

log_info() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}" | tee -a "$TEST_LOG"
}

# 프로젝트 루트
PROJECT_ROOT="/d/Workspace/GrowAI_LMS/MalgnLMS-clean"

echo "================================================================================" | tee "$TEST_LOG"
echo "  MalgnLMS 로컬 배포 테스트" | tee -a "$TEST_LOG"
echo "================================================================================" | tee -a "$TEST_LOG"
log_info "테스트 시작: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "로그 파일: $TEST_LOG"
echo "================================================================================" | tee -a "$TEST_LOG"
echo "" | tee -a "$TEST_LOG"

# 1. 백엔드 JAR 확인
log_info "1단계: 백엔드 JAR 파일 확인"
cd "$PROJECT_ROOT/polytech-lms-api"

if [ -f "build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar" ]; then
    JAR_SIZE=$(du -h build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar | cut -f1)
    log_success "백엔드 JAR 존재: $JAR_SIZE"
else
    log_error "백엔드 JAR 파일이 없습니다. 먼저 빌드를 실행하세요."
    exit 1
fi

echo "" | tee -a "$TEST_LOG"

# 2. 프론트엔드 빌드 확인
log_info "2단계: 프론트엔드 빌드 파일 확인"
cd "$PROJECT_ROOT"

if [ -d "public_html/tutor_lms/app" ]; then
    DIST_SIZE=$(du -sh public_html/tutor_lms/app | cut -f1)
    log_success "프론트엔드 빌드 존재: $DIST_SIZE"
else
    log_error "프론트엔드 빌드가 없습니다. 먼저 빌드를 실행하세요."
    exit 1
fi

echo "" | tee -a "$TEST_LOG"

# 3. 백엔드 서버 시작 (백그라운드)
log_info "3단계: 백엔드 서버 시작 중..."
cd "$PROJECT_ROOT/polytech-lms-api"

# 기존 프로세스 확인 및 종료
BACKEND_PID=$(lsof -ti:8081 2>/dev/null || true)
if [ ! -z "$BACKEND_PID" ]; then
    log_info "기존 백엔드 프로세스 종료 (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null || true
    sleep 2
fi

# JAR 실행 (백그라운드)
log_info "백엔드 서버 시작 (포트: 8081)..."
nohup java -jar \
    -Dspring.profiles.active=local \
    -Dspring.jpa.hibernate.ddl-auto=none \
    build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar \
    > "$LOG_DIR/backend_$(date +%Y%m%d).log" 2>&1 &

BACKEND_PID=$!
log_info "백엔드 PID: $BACKEND_PID"

# 서버 시작 대기
log_info "백엔드 서버 시작 대기 중..."
RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
        log_success "백엔드 서버 시작 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "." | tee -a "$TEST_LOG"
    sleep 2
done

echo "" | tee -a "$TEST_LOG"

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "백엔드 서버 시작 실패 (타임아웃)"
    log_info "로그 확인: $LOG_DIR/backend_$(date +%Y%m%d).log"
    exit 1
fi

echo "" | tee -a "$TEST_LOG"

# 4. 프론트엔드 서버 시작
log_info "4단계: 프론트엔드 미리보기 서버 시작 중..."
cd "$PROJECT_ROOT/project"

# 기존 프로세스 확인 및 종료
FRONTEND_PID=$(lsof -ti:4173 2>/dev/null || true)
if [ ! -z "$FRONTEND_PID" ]; then
    log_info "기존 프론트엔드 프로세스 종료 (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null || true
    sleep 2
fi

# 프론트엔드 서버 시작 (백그라운드)
log_info "프론트엔드 서버 시작 (포트: 4173)..."
nohup npm run preview > "$LOG_DIR/frontend_$(date +%Y%m%d).log" 2>&1 &

FRONTEND_PID=$!
log_info "프론트엔드 PID: $FRONTEND_PID"

# 서버 시작 대기
log_info "프론트엔드 서버 시작 대기 중..."
RETRIES=15
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if curl -s http://localhost:4173 > /dev/null 2>&1; then
        log_success "프론트엔드 서버 시작 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "." | tee -a "$TEST_LOG"
    sleep 2
done

echo "" | tee -a "$TEST_LOG"

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "프론트엔드 서버 시작 실패 (타임아웃)"
    log_info "로그 확인: $LOG_DIR/frontend_$(date +%Y%m%d).log"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo "" | tee -a "$TEST_LOG"

# 5. 통합 테스트
log_info "5단계: 통합 테스트 실행 중..."

# 백엔드 헬스 체크
log_info "백엔드 헬스 체크..."
HEALTH_RESPONSE=$(curl -s http://localhost:8081/actuator/health)
if echo "$HEALTH_RESPONSE" | grep -q "UP"; then
    log_success "백엔드 헬스 체크 통과"
else
    log_error "백엔드 헬스 체크 실패"
    echo "$HEALTH_RESPONSE" | tee -a "$TEST_LOG"
fi

# 프론트엔드 접속 테스트
log_info "프론트엔드 접속 테스트..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    log_success "프론트엔드 접속 성공 (HTTP $FRONTEND_RESPONSE)"
else
    log_error "프론트엔드 접속 실패 (HTTP $FRONTEND_RESPONSE)"
fi

echo "" | tee -a "$TEST_LOG"

# 결과 요약
echo "================================================================================" | tee -a "$TEST_LOG"
log_success "로컬 배포 테스트 완료!"
echo "================================================================================" | tee -a "$TEST_LOG"
echo "" | tee -a "$TEST_LOG"

log_info "접속 정보:"
log_info "  - 백엔드 API: http://localhost:8081"
log_info "  - 백엔드 헬스: http://localhost:8081/actuator/health"
log_info "  - 프론트엔드: http://localhost:4173"
log_info ""
log_info "프로세스 정보:"
log_info "  - 백엔드 PID: $BACKEND_PID"
log_info "  - 프론트엔드 PID: $FRONTEND_PID"
log_info ""
log_info "로그 파일:"
log_info "  - 테스트 로그: $TEST_LOG"
log_info "  - 백엔드 로그: $LOG_DIR/backend_$(date +%Y%m%d).log"
log_info "  - 프론트엔드 로그: $LOG_DIR/frontend_$(date +%Y%m%d).log"

echo "" | tee -a "$TEST_LOG"
log_info "서버 종료 방법:"
log_info "  kill $BACKEND_PID $FRONTEND_PID"
log_info "  또는: pkill -f polytech-lms-api; pkill -f 'npm.*preview'"

echo "================================================================================" | tee -a "$TEST_LOG"

# PID 저장
echo $BACKEND_PID > "$LOG_DIR/backend.pid"
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"

log_success "배포 테스트 성공! 서버가 실행 중입니다."
