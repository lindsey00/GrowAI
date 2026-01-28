#!/bin/bash

# GrowAI-MAP 백엔드 서버 시작 스크립트

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "GrowAI-MAP Backend 서버를 시작합니다..."
echo "포트: 8080"
echo ""

cd "$PROJECT_ROOT/backend"

# JAR 파일 확인
if [ ! -f "build/libs/growai-map-backend-1.0.0.jar" ]; then
    echo "오류: JAR 파일을 찾을 수 없습니다."
    echo "먼저 빌드를 실행하세요: ./gradlew clean build"
    exit 1
fi

# 서버 시작
java -jar build/libs/growai-map-backend-1.0.0.jar
