#!/bin/bash
# MalgnLMS 로컬 개발 환경 종료 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

LOG_DIR="/d/Workspace/GrowAI_LMS/logs"

log_info() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

echo "================================================================================"
echo "  MalgnLMS 로컬 개발 환경 종료"
echo "================================================================================"
echo ""

# 1. 백엔드 종료
if [ -f "$LOG_DIR/backend.pid" ]; then
    BACKEND_PID=$(cat "$LOG_DIR/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        log_info "백엔드 서버 종료 중 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        sleep 2
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill -9 $BACKEND_PID 2>/dev/null || true
        fi
        log_success "백엔드 서버 종료 완료"
    else
        log_info "백엔드 서버가 실행 중이 아닙니다"
    fi
    rm -f "$LOG_DIR/backend.pid"
else
    # PID 파일이 없으면 포트로 찾기
    BACKEND_PID=$(lsof -ti:8081 2>/dev/null || true)
    if [ ! -z "$BACKEND_PID" ]; then
        log_info "포트 8081에서 실행 중인 프로세스 종료 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        sleep 2
        log_success "백엔드 서버 종료 완료"
    else
        log_info "백엔드 서버가 실행 중이 아닙니다"
    fi
fi

echo ""

# 2. 프론트엔드 종료
if [ -f "$LOG_DIR/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$LOG_DIR/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        log_info "프론트엔드 서버 종료 중 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
        sleep 2
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill -9 $FRONTEND_PID 2>/dev/null || true
        fi
        log_success "프론트엔드 서버 종료 완료"
    else
        log_info "프론트엔드 서버가 실행 중이 아닙니다"
    fi
    rm -f "$LOG_DIR/frontend.pid"
else
    # PID 파일이 없으면 포트로 찾기
    FRONTEND_PID=$(lsof -ti:4173 2>/dev/null || true)
    if [ ! -z "$FRONTEND_PID" ]; then
        log_info "포트 4173에서 실행 중인 프로세스 종료 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
        sleep 2
        log_success "프론트엔드 서버 종료 완료"
    else
        log_info "프론트엔드 서버가 실행 중이 아닙니다"
    fi
fi

echo ""

# 3. Docker 서비스 종료
log_info "Docker 서비스 종료 중 (MySQL + Qdrant)..."
cd "/d/Workspace/GrowAI_LMS/MalgnLMS-clean"

if docker-compose ps | grep -q "Up"; then
    docker-compose down
    log_success "Docker 서비스 종료 완료"
else
    log_info "Docker 서비스가 실행 중이 아닙니다"
fi

echo ""
echo "================================================================================"
log_success "모든 서비스가 종료되었습니다"
echo "================================================================================"
echo ""
log_info "데이터 유지: MySQL 및 Qdrant 데이터는 Docker 볼륨에 보존됩니다"
log_info "데이터 삭제: docker-compose down -v (볼륨 포함 삭제)"
echo ""
