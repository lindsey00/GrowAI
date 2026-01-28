#!/bin/bash

# GrowAI-MAP 정리 스크립트
# 빌드 결과물과 임시 파일을 정리합니다

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== GrowAI-MAP 프로젝트 정리 ===${NC}"
echo ""

# Backend 정리
echo "Backend 빌드 결과물 정리 중..."
if [ -d "$PROJECT_ROOT/backend/build" ]; then
    rm -rf "$PROJECT_ROOT/backend/build"
    echo -e "${GREEN}✓ Backend build 디렉토리 삭제 완료${NC}"
fi

if [ -d "$PROJECT_ROOT/backend/.gradle" ]; then
    rm -rf "$PROJECT_ROOT/backend/.gradle"
    echo -e "${GREEN}✓ Backend .gradle 디렉토리 삭제 완료${NC}"
fi

# Frontend 정리
if [ -d "$PROJECT_ROOT/frontend/dist" ]; then
    rm -rf "$PROJECT_ROOT/frontend/dist"
    echo -e "${GREEN}✓ Frontend dist 디렉토리 삭제 완료${NC}"
fi

if [ -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠ node_modules 디렉토리를 삭제하려면 '-a' 옵션을 사용하세요${NC}"
fi

# Docker 정리 (옵션)
if [ "$1" == "-docker" ] || [ "$1" == "-d" ]; then
    echo ""
    echo "Docker 컨테이너 정리 중..."
    cd "$PROJECT_ROOT/infrastructure"
    docker-compose down -v 2>/dev/null || true
    echo -e "${GREEN}✓ Docker 컨테이너 정리 완료${NC}"
fi

echo ""
echo -e "${GREEN}=== 정리 완료 ===${NC}"
