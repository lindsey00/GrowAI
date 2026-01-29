D:\WorkSpace\GrowAI-MAP
├── scripts/                # 관리 및 빌드 스크립트 (.bat)
│   ├── master_build.bat    # 전체 공정 통합 실행 파일
│   ├── gen_env.bat         # 환경 변수(.env) 자동 생성
│   ├── gen_backend.bat     # 백엔드 코드 생성
│   ├── gen_frontend.bat    # 프론트엔드 코드 생성
│   └── gen_db.bat          # DB 스키마 생성
├── src/                    # Gemini가 생성한 소스 코드
│   ├── backend/            # FastAPI 소스
│   ├── frontend/           # Next.js/React 소스
│   └── database/           # SQL 및 Docker 설정
└── .env                    # 자동 생성된 환경 설정 파일



# 🏭 GrowAI-MAP 프로젝트 구성 및 자동화 도구 일람

본 문서는 **Google Native AI Toolchain (Gemini CLI)**을 활용하여 구축된 제조 AI 통합 플랫폼의 디렉토리 구조와 자동화 스크립트 명세를 다룹니다.

---

## 📢 프로젝트 핵심 정의
> **GrowAI-MAP은 제조 현장의 데이터를 수집, 분석하고 AI 모델을 활용하여 생산 효율성을 극대화하기 위한 제조 AI 통합 플랫폼입니다.**

---

## 📂 프로젝트 디렉토리 및 소스 목록

| 폴더/파일 경로 | 설명 | 비고 |
| :--- | :--- | :--- |
| **`scripts\master_build.bat`** | **전체 자동화 마스터 스크립트** | **최초 구축 시 이 파일만 실행** |
| `scripts\gen_env.bat` | 프로젝트 환경 변수(.env) 자동 생성 | DB 접속 정보 및 API 키 관리 |
| `scripts\gen_backend.bat` | FastAPI 기반 백엔드 소스 생성 | Python 비동기 로직 및 AI 엔드포인트 |
| `scripts\gen_frontend.bat` | Next.js 기반 대시보드 컴포넌트 생성 | Recharts 활용 실시간 시각화 컴포넌트 |
| `scripts\gen_db.bat` | PostgreSQL 테이블 스키마(SQL) 생성 | Index 최적화 및 제약조건 포함 |
| `scripts\gen_data.bat` | 고정밀 제조 데이터(1,000건) 생성 | 노이즈, 드리프트 등 예외 케이스 반영 |
| `scripts\run_docker.bat` | Docker 인프라 구성 및 자동 실행 | PostgreSQL 15 & pgAdmin4 연동 |
| `src\database\dummy_data.json` | 생성된 가상 제조 데이터 세트 | AI 모델 학습 및 성능 테스트용 |
| `src\database\schema.sql` | 데이터베이스 테이블 설계 스크립트 | DB 초기화 및 구조 정의용 |
| `docker-compose.yml` | 컨테이너 오케스트레이션 정의 파일 | Gemini CLI 기반 자동 생성본 |

---

## 🚀 주요 자동화 및 최적화 전략

### 1. 통합 빌드 시스템 (Single-Command Workflow)
`master_build.bat` 하나로 환경 설정부터 코드 생성, 인프라 배포까지 전체 파이프라인을 자동화하여 개발 초기 설정 시간을 90% 이상 단축합니다.

###