#!/bin/bash

# GrowAI-MAP 개발 서버 시작 스크립트
# H2 Database + dev 프로파일로 실행

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== GrowAI-MAP 개발 서버 시작 ==="
echo "프로파일: dev"
echo "데이터베이스: H2 인메모리"
echo "포트: 8080"
echo "H2 Console: http://localhost:8080/h2-console"
echo ""

cd "$PROJECT_ROOT/backend"

# JAR 파일 확인
if [ ! -f "build/libs/growai-map-backend-1.0.0.jar" ]; then
    echo "오류: JAR 파일을 찾을 수 없습니다."
    echo "먼저 빌드를 실행하세요: ./gradlew clean build"
    exit 1
fi

# 서버 시작 (dev 프로파일)
echo "서버를 시작합니다..."
java -jar -Dspring.profiles.active=dev build/libs/growai-map-backend-1.0.0.jar
