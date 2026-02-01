#!/bin/bash
# MalgnLMS 로컬 개발 환경 시작 스크립트
# MySQL + Qdrant + Backend + Frontend 통합 실행

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 프로젝트 경로
PROJECT_ROOT="/d/Workspace/GrowAI_LMS/MalgnLMS-clean"
LOG_DIR="/d/Workspace/GrowAI_LMS/logs"

# 로그 함수
log_info() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

echo "================================================================================"
echo "  MalgnLMS 로컬 개발 환경 시작"
echo "================================================================================"
log_info "시작 시간: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================================================"
echo ""

cd "$PROJECT_ROOT"

# 1. Docker 서비스 시작
log_info "1단계: Docker 서비스 시작 (MySQL + Qdrant)"
echo ""

if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되어 있지 않습니다!"
    log_info "Docker Desktop을 설치해주세요: https://www.docker.com/products/docker-desktop"
    exit 1
fi

log_info "Docker Compose로 서비스 시작 중..."
docker-compose up -d

echo ""
log_info "서비스 상태 확인 중..."
sleep 3

# 2. MySQL 연결 대기
log_info "2단계: MySQL 연결 대기 중..."
RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if docker exec malgnlms-mysql mysqladmin ping -h localhost -u root -proot --silent &> /dev/null; then
        log_success "MySQL 준비 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

echo ""

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "MySQL 시작 실패 (타임아웃)"
    docker-compose logs mysql
    exit 1
fi

echo ""

# 3. Qdrant 연결 대기
log_info "3단계: Qdrant 연결 대기 중..."
RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if curl -s http://localhost:6333/health > /dev/null 2>&1; then
        log_success "Qdrant 준비 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

echo ""

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "Qdrant 시작 실패 (타임아웃)"
    docker-compose logs qdrant
    exit 1
fi

echo ""

# 4. 백엔드 빌드
log_info "4단계: 백엔드 빌드 중..."
cd "$PROJECT_ROOT/polytech-lms-api"

if [ ! -f "build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar" ]; then
    log_info "JAR 파일이 없습니다. 빌드를 시작합니다..."
    ./gradlew clean bootJar -x test --no-daemon

    if [ $? -eq 0 ]; then
        log_success "백엔드 빌드 완료"
    else
        log_error "백엔드 빌드 실패"
        exit 1
    fi
else
    log_success "기존 JAR 파일 사용"
fi

echo ""

# 5. 백엔드 서버 시작
log_info "5단계: 백엔드 서버 시작 중..."

# 기존 프로세스 확인 및 종료
BACKEND_PID=$(lsof -ti:8081 2>/dev/null || true)
if [ ! -z "$BACKEND_PID" ]; then
    log_info "기존 백엔드 프로세스 종료 (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null || true
    sleep 2
fi

# 백엔드 시작
mkdir -p "$LOG_DIR"
nohup java -jar \
    -Dspring.profiles.active=local \
    build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar \
    > "$LOG_DIR/backend_$(date +%Y%m%d).log" 2>&1 &

BACKEND_PID=$!
echo $BACKEND_PID > "$LOG_DIR/backend.pid"
log_info "백엔드 PID: $BACKEND_PID"

# 백엔드 시작 대기
log_info "백엔드 서버 시작 대기 중..."
RETRIES=60
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
        log_success "백엔드 서버 시작 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

echo ""

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "백엔드 서버 시작 실패 (타임아웃)"
    log_info "로그 확인: $LOG_DIR/backend_$(date +%Y%m%d).log"
    tail -50 "$LOG_DIR/backend_$(date +%Y%m%d).log"
    exit 1
fi

# 백엔드 헬스 체크
HEALTH_RESPONSE=$(curl -s http://localhost:8081/actuator/health)
if echo "$HEALTH_RESPONSE" | grep -q "UP"; then
    log_success "백엔드 헬스 체크 통과"
else
    log_warning "백엔드 헬스 체크 경고"
    echo "$HEALTH_RESPONSE"
fi

echo ""

# 6. 프론트엔드 서버 시작
log_info "6단계: 프론트엔드 서버 시작 중..."
cd "$PROJECT_ROOT/project"

# 프론트엔드 빌드 확인
if [ ! -d "../public_html/tutor_lms/app" ]; then
    log_info "프론트엔드 빌드가 없습니다. 빌드를 시작합니다..."
    npm install
    npm run build
fi

# 기존 프로세스 확인 및 종료
FRONTEND_PID=$(lsof -ti:4173 2>/dev/null || true)
if [ ! -z "$FRONTEND_PID" ]; then
    log_info "기존 프론트엔드 프로세스 종료 (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null || true
    sleep 2
fi

# 프론트엔드 시작
nohup npm run preview > "$LOG_DIR/frontend_$(date +%Y%m%d).log" 2>&1 &

FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"
log_info "프론트엔드 PID: $FRONTEND_PID"

# 프론트엔드 시작 대기
log_info "프론트엔드 서버 시작 대기 중..."
RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRIES ]; do
    if curl -s http://localhost:4173 > /dev/null 2>&1; then
        log_success "프론트엔드 서버 시작 완료!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

echo ""

if [ $RETRY_COUNT -eq $RETRIES ]; then
    log_error "프론트엔드 서버 시작 실패 (타임아웃)"
    log_info "로그 확인: $LOG_DIR/frontend_$(date +%Y%m%d).log"
    exit 1
fi

echo ""

# 완료 메시지
echo "================================================================================"
log_success "MalgnLMS 로컬 개발 환경 시작 완료!"
echo "================================================================================"
echo ""
log_info "🌐 접속 정보:"
log_info "  - 프론트엔드:     http://localhost:4173"
log_info "  - 백엔드 API:     http://localhost:8081"
log_info "  - 백엔드 Health:  http://localhost:8081/actuator/health"
log_info "  - MySQL:          localhost:3306 (lmsuser/lmspassword)"
log_info "  - Qdrant:         http://localhost:6333"
log_info "  - Qdrant UI:      http://localhost:6333/dashboard"
echo ""
log_info "📝 로그 파일:"
log_info "  - 백엔드:   $LOG_DIR/backend_$(date +%Y%m%d).log"
log_info "  - 프론트엔드: $LOG_DIR/frontend_$(date +%Y%m%d).log"
echo ""
log_info "🔧 프로세스 정보:"
log_info "  - 백엔드 PID:     $BACKEND_PID"
log_info "  - 프론트엔드 PID: $FRONTEND_PID"
echo ""
log_info "⏹️  서버 종료 방법:"
log_info "  ./stop-local.sh"
log_info "  또는: kill $BACKEND_PID $FRONTEND_PID && docker-compose down"
echo "================================================================================"
