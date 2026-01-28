# GrowAI-MAP

**제조 AX 전환을 위한 지능형 분석 및 예측 플랫폼**

## 프로젝트 개요

GrowAI-MAP (Manufacturing Analysis & Prediction)은 제조업체의 '5대 고민'을 데이터로 진단하고, 최적의 AI/로봇 솔루션을 매칭하며, 도입 후의 경제적 이익(ROI)과 ESG 성과를 시뮬레이션하는 B2B 플랫폼입니다.

### 주요 기능

- **자가진단 엔진**: 제조 5대 고민(품질, 설비, 공정, 안전, 인력) 기반 진단
- **ROI 시뮬레이터**: Standard vs Custom 솔루션의 투자 대비 효과 분석
- **ESG 성과 측정**: 탄소 배출 감소 및 에너지 효율 개선 시뮬레이션
- **지능형 매칭**: AI 기반 최적 솔루션 파트너 추천

## 기술 스택

### Backend
- **Framework**: Spring Boot 3.2.2 + Java 17
- **Database**: PostgreSQL 16 + Redis 7
- **ORM**: Spring Data JPA + MyBatis
- **Security**: Spring Security + JWT
- **Documentation**: Swagger/OpenAPI 3.0

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **State Management**: React Query
- **Charts**: Recharts

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: Ready for GitHub Actions

## 프로젝트 구조

```
GrowAI-MAP/
├── backend/                    # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/newcle/growaimap/
│   │   │   │       ├── controller/     # REST API 컨트롤러
│   │   │   │       ├── domain/         # 도메인 모델
│   │   │   │       ├── dto/            # 데이터 전송 객체
│   │   │   │       └── service/        # 비즈니스 로직
│   │   │   └── resources/
│   │   │       ├── application.yml     # 애플리케이션 설정
│   │   │       └── mapper/             # MyBatis 매퍼
│   │   └── test/
│   ├── build.gradle                    # Gradle 빌드 설정
│   └── Dockerfile                      # 백엔드 Docker 이미지
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/         # React 컴포넌트
│   │   ├── pages/              # 페이지 컴포넌트
│   │   ├── services/           # API 서비스
│   │   └── types/              # TypeScript 타입 정의
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile              # 프론트엔드 Docker 이미지
│
├── infrastructure/             # 인프라 설정
│   ├── docker-compose.yml      # Docker Compose 설정
│   ├── nginx/                  # Nginx 설정
│   └── init-scripts/           # DB 초기화 스크립트
│
├── scripts/                    # 유틸리티 스크립트
│   ├── health-check.sh         # 서비스 상태 확인
│   ├── test-api.sh             # API 테스트
│   ├── start-backend.sh        # 백엔드 서버 시작
│   └── cleanup.sh              # 빌드 결과물 정리
│
├── build.sh                    # 통합 빌드 스크립트
├── CLAUDE_CODE_COMMANDS.md     # 실행 명령어 가이드
└── README.md                   # 이 파일
```

## 시작하기

### 필수 요구사항

- **Java 17** 이상
- **Node.js 18** 이상 (프론트엔드 빌드용)
- **Docker & Docker Compose** (컨테이너 배포용, 선택사항)

### 1. 환경 검증

```bash
./build.sh check
```

### 2. 백엔드 빌드

```bash
cd backend
chmod +x gradlew
./gradlew clean build -x test --no-daemon
```

### 3. 프론트엔드 빌드

```bash
cd frontend
npm install
npm run build
```

### 4. 개발 서버 실행

**백엔드 실행** (포트 8080):
```bash
cd backend
./gradlew bootRun --no-daemon
```

**프론트엔드 실행** (포트 5173):
```bash
cd frontend
npm run dev
```

### 5. Docker 배포 (전체 스택)

```bash
cd infrastructure
docker-compose up --build -d
```

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

### 주요 API 엔드포인트

#### Health Check
```bash
GET /api/health
```

#### 자가진단 API
```bash
POST /api/diagnosis/self
Content-Type: application/json

{
  "companyId": "test-company-001",
  "industryType": "ELECTRONICS",
  "employeeCount": 150,
  "annualRevenue": 50000000000,
  "answers": [
    {"questionId": "Q001", "agonyType": "QUALITY", "score": 4},
    {"questionId": "Q002", "agonyType": "EQUIPMENT", "score": 3}
  ]
}
```

#### ROI 시뮬레이션 API
```bash
POST /api/diagnosis/roi-simulation
Content-Type: application/json

{
  "diagnosisId": "test-diagnosis-001",
  "laborCost": 5000,
  "defectRate": 5.5,
  "energyCost": 800,
  "carbonEmission": 120,
  "solutionType": "CUSTOM"
}
```

## 제조 5대 고민 모델

| 코드 | 고민 유형 | 영문명 | 솔루션 |
|------|----------|--------|--------|
| QUALITY | 품질 블라인드 | Quality Blind | Vision AI |
| EQUIPMENT | 돌발 셧다운 | Sudden Shutdown | Predictive Maintenance |
| PROCESS | 깜깜이 공정 | Pitch-Black Process | APS/공정 최적화 |
| SAFETY | 위험 사각지대 | Danger Zone | Safety AI |
| LABOR | 인력난/반복노동 | Labor Shortage | Robot Automation |

## 시큐어 코딩

본 프로젝트는 행정안전부 시큐어 코딩 가이드를 준수합니다:

- ✅ **SQL Injection 방지**: MyBatis `#{}` 파라미터 바인딩 사용
- ✅ **입력값 검증**: `@Valid`, `@Size`, `@NotBlank` 등 Bean Validation 적용
- ✅ **XSS 방지**: Nginx Security Headers 적용
- ✅ **인증/인가**: JWT 기반 Stateless 인증
- ✅ **CORS**: 화이트리스트 기반 도메인 허용
- ✅ **파일 업로드**: 확장자 및 크기 검증

## 테스트

### 헬스체크
```bash
./scripts/health-check.sh
```

### API 테스트
```bash
./scripts/test-api.sh
```

## 유지보수

### 빌드 결과물 정리
```bash
./scripts/cleanup.sh
```

### Docker 컨테이너 포함 전체 정리
```bash
./scripts/cleanup.sh -docker
```

### 로그 확인
```bash
# 빌드 로그
cat build_log.txt

# 작업 실행 로그
cat build_execution_log.txt

# Docker 로그
docker-compose -f infrastructure/docker-compose.yml logs -f
```

## 서비스 접속 URL

| 서비스 | URL | 설명 |
|--------|-----|------|
| Frontend (Prod) | http://localhost:3000 | React 웹 UI (프로덕션) |
| Frontend (Dev) | http://localhost:5173 | React 웹 UI (개발) |
| Backend API | http://localhost:8080 | REST API |
| API Health | http://localhost:8080/api/health | 헬스체크 |
| Swagger UI | http://localhost:8080/swagger-ui.html | API 문서 |
| PostgreSQL | localhost:5432 | 데이터베이스 |
| Redis | localhost:6379 | 캐시 서버 |

## 라이센스

Copyright © 2024 Newcle Inc. All rights reserved.

## 개발자

- **Company**: (주)뉴클 (Newcle Inc.)
- **Project**: GrowAI-MAP v1.0
- **Contact**: contact@newcle.com

---

**GrowAI-MAP** - 제조 스마트 팩토리의 시작
