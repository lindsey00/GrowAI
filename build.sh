#!/bin/bash

# GrowAI-MAP 빌드 및 배포 자동화 스크립트
# eGovFrame 4.2 + Spring Boot 3.2 + React 18

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$PROJECT_ROOT/build_log.txt"
ERROR_FILE="$PROJECT_ROOT/error_report.txt"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$ERROR_FILE"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARN: $1" >> "$LOG_FILE"
}

# 환경 체크
check_env() {
    log "=== 환경 검증 시작 ==="

    # Java 체크
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
        log "Java 버전: $JAVA_VERSION"
    else
        error "Java가 설치되어 있지 않습니다. Java 17 이상을 설치해주세요."
        exit 1
    fi

    # Node.js 체크
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log "Node.js 버전: $NODE_VERSION"
    else
        error "Node.js가 설치되어 있지 않습니다."
        exit 1
    fi

    # npm 체크
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        log "npm 버전: $NPM_VERSION"
    else
        error "npm이 설치되어 있지 않습니다."
        exit 1
    fi

    # Docker 체크
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        log "Docker 버전: $DOCKER_VERSION"
    else
        warn "Docker가 설치되어 있지 않습니다. Docker 배포를 사용하려면 설치해주세요."
    fi

    # Docker Compose 체크
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_VERSION=$(docker-compose --version)
        log "Docker Compose 버전: $DOCKER_COMPOSE_VERSION"
    else
        warn "Docker Compose가 설치되어 있지 않습니다."
    fi

    log "=== 환경 검증 완료 ==="
}

# 백엔드 의존성 설치
install_backend_deps() {
    log "=== 백엔드 의존성 설치 시작 ==="
    cd "$PROJECT_ROOT/backend"

    # Gradle wrapper에 실행 권한 부여
    chmod +x gradlew

    # 의존성 다운로드
    ./gradlew dependencies --no-daemon || {
        error "백엔드 의존성 설치 실패"
        exit 1
    }

    log "=== 백엔드 의존성 설치 완료 ==="
}

# 백엔드 빌드
build_backend() {
    log "=== 백엔드 빌드 시작 ==="
    cd "$PROJECT_ROOT/backend"

    ./gradlew clean build -x test --no-daemon || {
        error "백엔드 빌드 실패"
        exit 1
    }

    log "=== 백엔드 빌드 완료 ==="
}

# 프론트엔드 의존성 설치
install_frontend_deps() {
    log "=== 프론트엔드 의존성 설치 시작 ==="
    cd "$PROJECT_ROOT/frontend"

    npm install || {
        error "프론트엔드 의존성 설치 실패"
        exit 1
    }

    log "=== 프론트엔드 의존성 설치 완료 ==="
}

# 프론트엔드 빌드
build_frontend() {
    log "=== 프론트엔드 빌드 시작 ==="
    cd "$PROJECT_ROOT/frontend"

    npm run build || {
        error "프론트엔드 빌드 실패"
        exit 1
    }

    log "=== 프론트엔드 빌드 완료 ==="
}

# 개발 서버 실행
run_dev() {
    log "=== 개발 모드 실행 ==="

    # 백그라운드에서 백엔드 실행
    cd "$PROJECT_ROOT/backend"
    log "백엔드 서버 시작 중... (포트 8080)"
    ./gradlew bootRun --no-daemon &
    BACKEND_PID=$!

    # 프론트엔드 실행
    cd "$PROJECT_ROOT/frontend"
    log "프론트엔드 서버 시작 중... (포트 5173)"
    npm run dev

    # Cleanup
    kill $BACKEND_PID 2>/dev/null || true
}

# Docker 배포
deploy_docker() {
    log "=== Docker 배포 시작 ==="
    cd "$PROJECT_ROOT/infrastructure"

    docker-compose up --build -d || {
        error "Docker 배포 실패"
        exit 1
    }

    log "=== Docker 배포 완료 ==="
    log "서비스 접속 URL:"
    log "  - Frontend: http://localhost:3000"
    log "  - Backend API: http://localhost:8080"
    log "  - API Health: http://localhost:8080/api/health"
    log "  - Swagger UI: http://localhost:8080/swagger-ui.html"
}

# 정리
clean() {
    log "=== 프로젝트 정리 시작 ==="

    # 백엔드 정리
    if [ -d "$PROJECT_ROOT/backend" ]; then
        cd "$PROJECT_ROOT/backend"
        ./gradlew clean --no-daemon || true
    fi

    # 프론트엔드 정리
    if [ -d "$PROJECT_ROOT/frontend/dist" ]; then
        rm -rf "$PROJECT_ROOT/frontend/dist"
    fi

    if [ -d "$PROJECT_ROOT/frontend/node_modules" ]; then
        warn "node_modules 디렉토리를 삭제하려면 'rm -rf frontend/node_modules'를 실행하세요."
    fi

    log "=== 프로젝트 정리 완료 ==="
}

# 전체 빌드
build_all() {
    log "=== 전체 빌드 시작 ==="

    check_env
    install_backend_deps
    build_backend
    install_frontend_deps
    build_frontend

    log "=== 전체 빌드 완료 ==="
}

# 사용법 출력
usage() {
    echo "GrowAI-MAP 빌드 스크립트"
    echo ""
    echo "사용법: ./build.sh [command]"
    echo ""
    echo "Commands:"
    echo "  check       - 환경 검증"
    echo "  all         - 전체 빌드 (의존성 설치 + 빌드)"
    echo "  dev         - 개발 모드 실행"
    echo "  deploy      - Docker 배포"
    echo "  clean       - 빌드 결과물 정리"
    echo "  backend     - 백엔드만 빌드"
    echo "  frontend    - 프론트엔드만 빌드"
    echo ""
}

# 메인 로직
case "${1:-}" in
    check)
        check_env
        ;;
    all)
        build_all
        ;;
    dev)
        run_dev
        ;;
    deploy)
        deploy_docker
        ;;
    clean)
        clean
        ;;
    backend)
        install_backend_deps
        build_backend
        ;;
    frontend)
        install_frontend_deps
        build_frontend
        ;;
    *)
        usage
        exit 1
        ;;
esac

exit 0
