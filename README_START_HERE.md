# 🚀 MalgnLMS 즉시 시작 가이드

## 📌 현재 상태

✅ **프로젝트 빌드 완료**
- 백엔드: Spring Boot JAR (134MB)
- 프론트엔드: React 빌드 완료

❌ **Docker가 설치되지 않음**
- MySQL과 Qdrant 실행을 위해 Docker가 필요합니다

---

## ⚡ 3단계로 즉시 시작하기

### 1단계: Docker Desktop 설치 (5분)

PowerShell을 **관리자 권한**으로 실행 후:

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\install-docker.ps1
```

**자동 다운로드 옵션**을 선택하면:
- Docker Desktop 자동 다운로드 (약 500MB)
- 설치 마법사 자동 실행
- 설치 후 안내 제공

**수동 설치**를 원하시면:
1. https://www.docker.com/products/docker-desktop 방문
2. "Download for Windows" 클릭
3. 다운로드한 파일 실행

---

### 2단계: 환경 확인 및 자동 시작 (1분)

Docker Desktop 설치 및 실행 후:

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\verify-and-start.ps1
```

이 스크립트가 자동으로:
- ✅ Docker 설치 확인
- ✅ Docker Desktop 실행 확인
- ✅ Java, Node.js 확인
- ✅ 빌드 파일 확인
- ✅ 전체 환경 자동 시작

---

### 3단계: 접속 확인

서버 시작 후 브라우저에서:

- **프론트엔드**: http://localhost:4173
- **백엔드 API**: http://localhost:8081
- **헬스 체크**: http://localhost:8081/actuator/health
- **Qdrant UI**: http://localhost:6333/dashboard

---

## 🛠️ 이미 Docker가 설치되어 있다면?

Docker Desktop이 실행 중인지 확인 후:

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
.\start-local.ps1
```

한 번의 명령으로 모든 서비스 시작:
- MySQL 데이터베이스
- Qdrant 벡터 스토어
- 백엔드 API 서버
- 프론트엔드 개발 서버

---

## 🔧 수동 실행 (고급 사용자)

Docker 없이 직접 서비스를 설치하고 실행하려면:

1. **MySQL 8.0 설치**
   - https://dev.mysql.com/downloads/mysql/
   - 데이터베이스: `lms`
   - 사용자: `lmsuser` / `lmspassword`

2. **Qdrant 설치**
   - https://github.com/qdrant/qdrant/releases
   - 포트: 6333

3. **백엔드 시작**
   ```powershell
   cd polytech-lms-api
   java -jar -Dspring.profiles.active=local build\libs\polytech-lms-api-0.0.1-SNAPSHOT.jar
   ```

4. **프론트엔드 시작**
   ```powershell
   cd project
   npm run preview
   ```

---

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
