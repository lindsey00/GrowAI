# GrowAI-MAP Claude Code 실행 명령어 세트
# 제조 AX 전환을 위한 지능형 분석 및 예측 플랫폼

> **SOP 기반**: eGovFrame 4.2 + Spring Boot 3.2 + React 18
> **시큐어코딩**: 행안부 가이드 준수 (MyBatis #{} 바인딩)
> **아키텍처**: Docker Compose 기반 마이크로서비스

---

## 📌 1단계: 프로젝트 초기화 (setup)

```bash
# 프로젝트 디렉토리 이동
cd /home/claude/GrowAI-MAP

# 실행 권한 부여
chmod +x build.sh
chmod +x scripts/*.sh 2>/dev/null || true

# 환경 검증
./build.sh check
```

---

## 📌 2단계: 의존성 설치 (dependencies)

### 2-1. 백엔드 의존성 (Gradle)
```bash
cd /home/claude/GrowAI-MAP/backend

# Gradle Wrapper 실행 권한
chmod +x gradlew

# 의존성 다운로드
./gradlew dependencies --no-daemon

# 프로젝트 빌드 (테스트 제외)
./gradlew clean build -x test --no-daemon
```

### 2-2. 프론트엔드 의존성 (npm)
```bash
cd /home/claude/GrowAI-MAP/frontend

# npm 의존성 설치
npm install

# 타입스크립트 빌드 검증
npm run build
```

---

## 📌 3단계: 로컬 개발 서버 실행

### 3-1. 백엔드 단독 실행 (개발 모드)
```bash
cd /home/claude/GrowAI-MAP/backend

# Spring Boot 개발 서버 실행
./gradlew bootRun --no-daemon

# API 헬스체크: http://localhost:8080/api/health
```

### 3-2. 프론트엔드 단독 실행 (개발 모드)
```bash
cd /home/claude/GrowAI-MAP/frontend

# Vite 개발 서버 실행
npm run dev

# 브라우저 접속: http://localhost:5173
```

---

## 📌 4단계: Docker 컨테이너 배포

### 4-1. 전체 스택 빌드 및 실행
```bash
cd /home/claude/GrowAI-MAP/infrastructure

# Docker Compose 빌드 및 실행
docker-compose up --build -d

# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f
```

### 4-2. 개별 서비스 관리
```bash
# 데이터베이스만 실행 (개발 시)
docker-compose up -d postgres redis

# 전체 중지
docker-compose down

# 볼륨 포함 완전 삭제
docker-compose down -v
```

---

## 📌 5단계: 헬스체크 및 검증

### 5-1. API 엔드포인트 테스트
```bash
# 헬스체크
curl -s http://localhost:8080/api/health | jq .

# 자가진단 API 테스트
curl -X POST http://localhost:8080/api/diagnosis/self \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "test-company-001",
    "industryType": "ELECTRONICS",
    "employeeCount": 150,
    "annualRevenue": 50000000000,
    "answers": [
      {"questionId": "Q001", "agonyType": "QUALITY", "score": 4},
      {"questionId": "Q002", "agonyType": "EQUIPMENT", "score": 3},
      {"questionId": "Q003", "agonyType": "PROCESS", "score": 5},
      {"questionId": "Q004", "agonyType": "SAFETY", "score": 2},
      {"questionId": "Q005", "agonyType": "LABOR", "score": 4}
    ]
  }' | jq .

# ROI 시뮬레이션 API 테스트
curl -X POST http://localhost:8080/api/diagnosis/roi-simulation \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosisId": "test-diagnosis-001",
    "laborCost": 5000,
    "defectRate": 5.5,
    "energyCost": 800,
    "carbonEmission": 120,
    "solutionType": "CUSTOM"
  }' | jq .
```

### 5-2. 데이터베이스 연결 확인
```bash
# PostgreSQL 연결 테스트
docker exec growai-postgres psql -U growai -d growai_map -c "\dt"

# Redis 연결 테스트
docker exec growai-redis redis-cli ping
```

---

## 📌 6단계: 빌드 로그 분석 및 오류 수정

### 6-1. 로그 확인
```bash
cd /home/claude/GrowAI-MAP

# 빌드 로그 확인
cat build_log.txt

# 에러 리포트 확인
cat error_report.txt

# 실시간 컨테이너 로그
docker-compose -f infrastructure/docker-compose.yml logs -f backend
```

### 6-2. 일반적인 오류 해결

```bash
# 포트 충돌 해결
sudo lsof -i :8080 | grep LISTEN
sudo kill -9 <PID>

# Docker 캐시 정리
docker system prune -f
docker builder prune -f

# Gradle 캐시 정리
cd backend && ./gradlew clean --no-daemon

# npm 캐시 정리
cd frontend && rm -rf node_modules && npm cache clean --force && npm install
```

---

## 📌 7단계: 백업 및 정리

### 7-1. 데이터 백업
```bash
cd /home/claude/GrowAI-MAP

# PostgreSQL 백업
docker exec growai-postgres pg_dump -U growai growai_map > backup_$(date +%Y%m%d).sql

# 전체 프로젝트 백업
tar -czvf GrowAI-MAP_backup_$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='build' \
  --exclude='.gradle' \
  .
```

### 7-2. 환경 정리
```bash
# 개발 환경 정리
./build.sh clean

# Docker 완전 정리
docker-compose -f infrastructure/docker-compose.yml down -v
docker system prune -af
```

---

## 🚀 원클릭 실행 명령어

### 전체 빌드 및 실행 (통합)
```bash
cd /home/claude/GrowAI-MAP && chmod +x build.sh && ./build.sh all
```

### 개발 모드 빠른 시작
```bash
cd /home/claude/GrowAI-MAP && ./build.sh dev
```

### Docker 배포
```bash
cd /home/claude/GrowAI-MAP && ./build.sh deploy
```

---

## 📊 서비스 접속 URL

| 서비스 | URL | 설명 |
|--------|-----|------|
| Frontend | http://localhost:3000 | React 웹 UI |
| Backend API | http://localhost:8080 | REST API |
| API Health | http://localhost:8080/api/health | 헬스체크 |
| Swagger | http://localhost:8080/swagger-ui.html | API 문서 |
| PostgreSQL | localhost:5432 | 데이터베이스 |
| Redis | localhost:6379 | 캐시 서버 |

---

## 🔧 제조 5대 고민 모델 API 명세

### 진단 카테고리
| 코드 | 고민 유형 | 영문명 | 솔루션 |
|------|----------|--------|--------|
| QUALITY | 품질 블라인드 | Quality Blind | Vision AI |
| EQUIPMENT | 돌발 셧다운 | Sudden Shutdown | Predictive Maintenance |
| PROCESS | 깜깜이 공정 | Pitch-Black Process | APS/공정 최적화 |
| SAFETY | 위험 사각지대 | Danger Zone | Safety AI |
| LABOR | 인력난/반복노동 | Labor Shortage | Robot Automation |

### 시급성 등급
| 평균 점수 | 등급 | 조치 |
|-----------|------|------|
| ≥ 4.0 | 매우높음 | 즉시 도입 권장 |
| ≥ 3.0 | 높음 | 6개월 내 검토 |
| ≥ 2.0 | 보통 | 1년 내 계획 |
| < 2.0 | 낮음 | 중장기 검토 |

---

## ⚡ 시큐어코딩 체크리스트

- [x] MyBatis: `#{}` 파라미터 바인딩 (SQL Injection 방지)
- [x] JWT: Stateless 인증, 24시간 Access Token
- [x] CORS: 허용 도메인 화이트리스트
- [x] 파일 업로드: 확장자 검증 (.csv, .json)
- [x] 입력값 검증: @Valid, @Size, @NotBlank
- [x] XSS 방지: Nginx Security Headers

---

*GrowAI-MAP v1.0 - (주)뉴클 (Newcle Inc.)*
