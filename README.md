개발/테스트 환경 - 인증 없이 API 직접 사용
1) Docker Desktop 설치

관리자 권한으로 PowerShell 실행
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\install-docker.ps1

자동 다운로드 옵션 선택 (Y)

2) Docker Desktop 실행
설치 완료 후:
시작 메뉴에서 "Docker Desktop" 검색 및 실행
시스템 트레이에서 Docker 아이콘이 초록색이 될 때까지 대기 (1-2분)

3) MalgnLMS 서비스 시작
Docker Desktop이 실행 중일 때 다음 파일을 더블클릭:
▶️ STEP2_Start_Services.bat 실행
또는 PowerShell에서:
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\verify-and-start.ps1

⏱️ 시작 시간: 최초 실행 시 약 3-5분 소요
(MySQL, Qdrant, 백엔드, 프론트엔드 순차 시작)

4) 서비스 접속
서비스가 시작되면 다음 URL로 접속할 수 있습니다:

🌐 프론트엔드:
http://localhost:4173
🔧 백엔드 API:
http://localhost:8081
💚 헬스 체크:
http://localhost:8081/actuator/health
🔍 Qdrant Dashboard:
http://localhost:6333/dashboard

5) 서비스 종료
작업이 끝나면 PowerShell에서:
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\stop-local.ps1

📝 참고:
인증 시스템: 현재 빌드는 인증 없이 API를 직접 사용합니다
데이터: MySQL 및 Qdrant 데이터는 Docker 볼륨에 저장되어 재시작 시에도 유지됩니다
로그: D:\Workspace\GrowAI_LMS\logs\ 폴더에서 확인 가능

🎯 시작 체크리스트
☐ STEP1_Install_Docker.bat 실행 (또는 수동 설치)
☐ Docker Desktop 실행 및 초록색 아이콘 확인
☐ STEP2_Start_Services.bat 실행 (또는 verify-and-start.ps1)
☐ http://localhost:4173 접속하여 프론트엔드 확인
☐ http://localhost:8081/actuator/health 접속하여 백엔드 확인

## 📚 상세 문서

더 자세한 정보는 다음 문서를 참조하세요:

- [LOCAL_DEPLOYMENT_GUIDE.md](LOCAL_DEPLOYMENT_GUIDE.md) - 완전한 배포 가이드
- [DEPLOYMENT_TEST_REPORT_20260201.md](../logs/DEPLOYMENT_TEST_REPORT_20260201.md) - 배포 테스트 보고서

---

## 🎯 빠른 명령어 참조

| 작업 | 명령어 |
|------|--------|
| Docker 설치 | `.\install-docker.ps1` |
| 환경 확인 및 시작 | `.\verify-and-start.ps1` |
| 전체 환경 시작 | `.\start-local.ps1` |
| 전체 환경 종료 | `.\stop-local.ps1` |
| Docker 서비스만 시작 | `docker-compose up -d` |
| Docker 서비스 종료 | `docker-compose down` |
| 로그 확인 | `docker-compose logs -f` |

---

## ❓ 문제 해결

### Docker Desktop이 시작되지 않음
1. Windows 업데이트 확인
2. WSL 2 설치 확인 (`wsl --install`)
3. 컴퓨터 재시작

### 포트 충돌
```powershell
# 사용 중인 포트 확인
Get-NetTCPConnection -LocalPort 8081
Get-NetTCPConnection -LocalPort 3306

# 프로세스 종료
.\stop-local.ps1
```

### 백엔드 시작 실패
```powershell
# 로그 확인
Get-Content D:\Workspace\GrowAI_LMS\logs\backend_<날짜>.log -Tail 50
```

---

## 💡 추천 개발 환경

- **IDE**: IntelliJ IDEA 또는 VS Code
- **MySQL 클라이언트**: DBeaver, MySQL Workbench
- **API 테스트**: Postman, Insomnia
- **Docker 관리**: Docker Desktop UI

---

**최종 업데이트**: 2026-02-01
**버전**: 1.0
**상태**: ✅ 배포 준비 완료


## 🔧 사전 요구사항

### 필수 설치 항목

1. **Java 17 이상**
   ```bash
   java -version
   ```

2. **Node.js 16 이상**
   ```bash
   node --version
   npm --version
   ```

3. **Docker Desktop**
   - Windows: https://www.docker.com/products/docker-desktop
   - 설치 후 Docker Desktop 실행 필수
   - 확인:
     ```powershell
     docker --version
     docker-compose --version
     ```

---

## 🚀 빠른 시작

### Windows (PowerShell)

```powershell
# 1. 프로젝트 디렉토리로 이동
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean

# 2. 전체 환경 시작 (MySQL + Qdrant + Backend + Frontend)
.\start-local.ps1

# 3. 서비스 접속
# - 프론트엔드: http://localhost:4173
# - 백엔드 API: http://localhost:8081
# - Qdrant UI: http://localhost:6333/dashboard

# 4. 종료
.\stop-local.ps1
```

### Linux/Mac (Bash)

```bash
# 1. 프로젝트 디렉토리로 이동
cd /d/Workspace/GrowAI_LMS/MalgnLMS-clean

# 2. 전체 환경 시작
./start-local.sh

# 3. 종료
./stop-local.sh
```

---

## 📁 프로젝트 구조

```
MalgnLMS-clean/
├── docker-compose.yml          # Docker 서비스 정의 (MySQL + Qdrant)
├── start-local.sh              # 통합 시작 스크립트 (Bash)
├── start-local.ps1             # 통합 시작 스크립트 (PowerShell)
├── stop-local.sh               # 통합 종료 스크립트 (Bash)
├── stop-local.ps1              # 통합 종료 스크립트 (PowerShell)
├── polytech-lms-api/           # 백엔드 (Spring Boot)
│   ├── src/main/resources/
│   │   ├── application.yml             # 메인 설정
│   │   └── application-local.yml       # 로컬 환경 설정
│   ├── build.gradle                    # Gradle 빌드 설정
│   └── build/libs/*.jar                # 빌드 산출물
└── project/                    # 프론트엔드 (React)
    ├── package.json
    └── dist/                           # 빌드 산출물
```

---

## 🐳 Docker 서비스

### 포함된 서비스

#### 1. MySQL 8.0
- **포트**: 3306
- **데이터베이스**: lms
- **사용자**: lmsuser
- **비밀번호**: lmspassword
- **Root 비밀번호**: root

#### 2. Qdrant (벡터 데이터베이스)
- **HTTP 포트**: 6333
- **gRPC 포트**: 6334
- **대시보드**: http://localhost:6333/dashboard

### Docker 명령어

```powershell
# 서비스 시작
docker-compose up -d

# 서비스 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f mysql
docker-compose logs -f qdrant

# 서비스 종료
docker-compose down

# 서비스 종료 + 볼륨 삭제 (데이터 초기화)
docker-compose down -v
```

---

## ⚙️ 수동 실행 방법

### 1. Docker 서비스만 시작

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
docker-compose up -d
```

### 2. 백엔드만 실행

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean\polytech-lms-api

# 빌드 (필요시)
.\gradlew.bat clean bootJar -x test

# 실행
java -jar -Dspring.profiles.active=local build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar
```

### 3. 프론트엔드만 실행

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean\project

# 의존성 설치 (최초 1회)
npm install

# 빌드 (필요시)
npm run build

# 개발 서버
npm run dev
# 또는 프로덕션 미리보기
npm run preview
```

---

## 🔍 트러블슈팅

### 1. Docker 관련 오류

**문제**: `docker: command not found` 또는 `docker-compose: command not found`

**해결**:
1. Docker Desktop 설치 확인
2. Docker Desktop 실행 확인 (시스템 트레이 확인)
3. PowerShell 재시작

---

### 2. 포트 충돌

**문제**: `Port 3306 is already allocated` 또는 `Port 8081 already in use`

**해결**:
```powershell
# 포트 사용 중인 프로세스 확인 (PowerShell)
Get-NetTCPConnection -LocalPort 3306
Get-NetTCPConnection -LocalPort 6333
Get-NetTCPConnection -LocalPort 8081
Get-NetTCPConnection -LocalPort 4173

# 프로세스 종료
Stop-Process -Id <PID> -Force

# 또는 stop 스크립트 사용
.\stop-local.ps1
```

---

### 3. 백엔드 시작 실패

**문제**: 백엔드 서버가 시작되지 않음

**해결**:
```powershell
# 로그 확인
type D:\Workspace\GrowAI_LMS\logs\backend_<날짜>.log

# MySQL 연결 확인
docker exec -it malgnlms-mysql mysql -u lmsuser -plmspassword -e "SHOW DATABASES;"

# Qdrant 연결 확인
curl http://localhost:6333/health
```

**주요 체크포인트**:
- MySQL 컨테이너 실행 중인지 확인
- Qdrant 컨테이너 실행 중인지 확인
- `application-local.yml` 설정 확인

---

### 4. 프론트엔드 빌드 오류

**문제**: `npm run build` 실패

**해결**:
```powershell
# node_modules 재설치
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean\project
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📊 데이터 관리

### MySQL 데이터 백업

```powershell
# 데이터베이스 덤프
docker exec malgnlms-mysql mysqldump -u lmsuser -plmspassword lms > backup.sql

# 복원
docker exec -i malgnlms-mysql mysql -u lmsuser -plmspassword lms < backup.sql
```

### MySQL 접속

```powershell
# Docker 컨테이너 내에서 접속
docker exec -it malgnlms-mysql mysql -u lmsuser -plmspassword lms

# 또는 로컬 MySQL 클라이언트 사용
# Host: localhost
# Port: 3306
# User: lmsuser
# Password: lmspassword
# Database: lms
```

### Qdrant 데이터

- 데이터는 Docker 볼륨 `malgnlms-clean_qdrant_data`에 저장됩니다
- 컨테이너 재시작 시에도 데이터 유지
- 데이터 삭제: `docker-compose down -v`

---

## 🔐 환경 설정

### application-local.yml

로컬 환경 전용 설정 파일입니다.

**위치**: `polytech-lms-api/src/main/resources/application-local.yml`

**주요 설정**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lms
    username: lmsuser
    password: lmspassword

  ai:
    vectorstore:
      qdrant:
        host: localhost
        port: 6333
```

**수정 방법**:
1. 파일 직접 편집
2. 빌드 전 설정 변경
3. JAR 재빌드 필요

---

## 📝 로그 파일

모든 로그는 `D:\Workspace\GrowAI_LMS\logs\` 디렉토리에 저장됩니다.

### 로그 종류

- `backend_<날짜>.log` - 백엔드 서버 로그
- `frontend_<날짜>.log` - 프론트엔드 서버 로그
- `backend.pid` - 백엔드 프로세스 ID
- `frontend.pid` - 프론트엔드 프로세스 ID

### 로그 확인

```powershell
# 실시간 로그 보기 (PowerShell)
Get-Content D:\Workspace\GrowAI_LMS\logs\backend_<날짜>.log -Wait -Tail 50

# 마지막 100줄 보기
Get-Content D:\Workspace\GrowAI_LMS\logs\backend_<날짜>.log -Tail 100
```

---

## 🎯 개발 워크플로우

### 일반적인 개발 흐름

1. **환경 시작**
   ```powershell
   .\start-local.ps1
   ```

2. **코드 수정**
   - 백엔드: `polytech-lms-api/src/`
   - 프론트엔드: `project/src/`

3. **백엔드 재시작** (코드 수정 후)
   ```powershell
   cd polytech-lms-api
   .\gradlew.bat bootJar -x test
   # 백엔드 프로세스 종료 후 재시작
   ```

4. **프론트엔드 재빌드** (필요시)
   ```powershell
   cd project
   npm run build
   ```

5. **환경 종료**
   ```powershell
   .\stop-local.ps1
   ```

---

## 🔗 유용한 링크

### 애플리케이션 URL
- 프론트엔드: http://localhost:4173
- 백엔드 API: http://localhost:8081
- Health Check: http://localhost:8081/actuator/health
- Qdrant Dashboard: http://localhost:6333/dashboard

### 외부 문서
- [Spring Boot 문서](https://spring.io/projects/spring-boot)
- [React 문서](https://react.dev)
- [Vite 문서](https://vitejs.dev)
- [Docker 문서](https://docs.docker.com)
- [MySQL 문서](https://dev.mysql.com/doc/)
- [Qdrant 문서](https://qdrant.tech/documentation/)

---

## ❓ FAQ

### Q: 초기 데이터를 어떻게 넣나요?

A: MySQL 컨테이너에 SQL 파일을 실행하세요:
```powershell
docker exec -i malgnlms-mysql mysql -u lmsuser -plmspassword lms < init-data.sql
```

### Q: 빌드 시간이 너무 오래 걸립니다.

A: 다음 옵션을 사용하세요:
```powershell
# 빌드 건너뛰기 (기존 JAR 사용)
.\start-local.ps1 -SkipBuild

# 테스트 건너뛰기
.\gradlew.bat bootJar -x test
```

### Q: Docker 데이터를 완전히 초기화하려면?

A:
```powershell
docker-compose down -v
docker volume prune -f
.\start-local.ps1
```

### Q: 프로덕션 환경과의 차이점은?

A: 로컬 환경은 다음과 같은 차이가 있습니다:
- Google GenAI: 더미 API 키 사용
- 데이터베이스: 로컬 Docker MySQL
- Qdrant: 로컬 Docker 인스턴스


#### 3. Google GenAI API (선택사항)
**현재 상태**: ⚠️ 더미 값으로 구성됨

실제 사용 시 필요:
- Google Cloud Project ID
- Google GenAI API Key
- 환경 변수 또는 `application-local.yml` 설정

---

## 🚀 배포 가이드

### 시나리오 A: 완전한 로컬 배포 (모든 기능 사용)

#### 1. 사전 준비
```bash
# Qdrant 시작 (Docker)
docker run -d -p 6333:6333 --name qdrant qdrant/qdrant

# (선택) MySQL 시작
docker run -d -p 3306:3306 --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=lms \
  mysql:8.0
```

#### 2. 환경 설정
**application-local.yml** 수정:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lms  # MySQL 사용 시
    # 또는
    url: jdbc:h2:mem:testdb  # H2 사용 시
```

#### 3. 빌드 및 실행
```bash
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean

# 백엔드 빌드
cd polytech-lms-api
./gradlew.bat clean build

# 백엔드 실행
java -jar -Dspring.profiles.active=local \
  build/libs/polytech-lms-api-0.0.1-SNAPSHOT.jar

# 프론트엔드 실행 (별도 터미널)
cd ../project
npm run preview
```

## 📝 테스트 로그

### 빌드 로그
- **위치**: `D:\Workspace\GrowAI_LMS\logs\MalgnLMS_clean_build_work_20260201.log`
- **빌드 시간**: 3분 16초
### 배포 테스트 로그
- **위치**: `D:\Workspace\GrowAI_LMS\logs\deployment_test_20260201_*.log`
- **시도 횟수**: 9회
### 백엔드 실행 로그
- **위치**: `D:\Workspace\GrowAI_LMS\logs/backend_20260201.log`
  
## 📎 관련 파일

### 설정 파일
- `polytech-lms-api/src/main/resources/application.yml` - 메인 설정
- `polytech-lms-api/src/main/resources/application-local.yml` - 로컬 설정 (생성됨)
- `polytech-lms-api/build.gradle` - 빌드 설정 (H2 의존성 추가됨)

### 스크립트
- `build-all.sh` / `build-all.ps1` - 통합 빌드 스크립트
- `deploy-test.sh` - 배포 테스트 스크립트

### 로그
- `logs/MalgnLMS_clean_build_work_20260201.log` - 빌드 로그
- `logs/deployment_test_*.log` - 배포 테스트 로그
- `logs/backend_20260201.log` - 백엔드 실행 로그

---

**보고서 생성일**: 2026-02-01 18:06
**보고서 버전**: 1.0
