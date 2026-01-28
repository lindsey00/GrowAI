#!/bin/bash

# GrowAI-MAP 헬스체크 스크립트
# 모든 서비스의 상태를 확인합니다

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GrowAI-MAP 헬스체크 ===${NC}"
echo ""

# Backend API 체크
echo -e "${YELLOW}[1/4] Backend API 상태 확인...${NC}"
if curl -s -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API: 정상 작동 중${NC}"
    curl -s http://localhost:8080/api/health | jq . 2>/dev/null || curl -s http://localhost:8080/api/health
else
    echo -e "${RED}✗ Backend API: 응답 없음${NC}"
    echo "  URL: http://localhost:8080/api/health"
fi
echo ""

# Frontend 체크
echo -e "${YELLOW}[2/4] Frontend 상태 확인...${NC}"
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend: 정상 작동 중${NC}"
elif curl -s -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend (Dev): 정상 작동 중${NC}"
    echo "  URL: http://localhost:5173"
else
    echo -e "${RED}✗ Frontend: 응답 없음${NC}"
    echo "  프로덕션 URL: http://localhost:3000"
    echo "  개발 URL: http://localhost:5173"
fi
echo ""

# PostgreSQL 체크
echo -e "${YELLOW}[3/4] PostgreSQL 상태 확인...${NC}"
if command -v docker &> /dev/null; then
    if docker ps | grep -q growai-postgres; then
        if docker exec growai-postgres pg_isready -U growai > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PostgreSQL: 정상 작동 중${NC}"
        else
            echo -e "${RED}✗ PostgreSQL: 응답 없음${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ PostgreSQL 컨테이너가 실행되고 있지 않습니다${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker가 설치되어 있지 않습니다${NC}"
fi
echo ""

# Redis 체크
echo -e "${YELLOW}[4/4] Redis 상태 확인...${NC}"
if command -v docker &> /dev/null; then
    if docker ps | grep -q growai-redis; then
        if docker exec growai-redis redis-cli ping > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Redis: 정상 작동 중${NC}"
        else
            echo -e "${RED}✗ Redis: 응답 없음${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Redis 컨테이너가 실행되고 있지 않습니다${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker가 설치되어 있지 않습니다${NC}"
fi
echo ""

echo -e "${BLUE}=== 헬스체크 완료 ===${NC}"
