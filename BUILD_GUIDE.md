# 🚀 MalgnLMS 빌드 가이드

## 📊 프로젝트 구조

```
MalgnLMS-clean/
├── polytech-lms-api/       ✅ Spring Boot 백엔드 (Java 17)
│   ├── src/                → 소스 코드
│   ├── gradle/             → Gradle 래퍼
│   ├── build.gradle        → 빌드 설정
│   ├── gradlew.bat         → Windows 빌드 스크립트
│   └── sql/                → 데이터베이스 스키마
│
├── project/                ✅ React 프론트엔드 (Vite + TypeScript)
│   ├── components/         → React 컴포넌트
│   ├── api/                → API 클라이언트
│   ├── package.json        → NPM 설정
│   └── vite.config.ts      → Vite 설정
│
├── src/                    ✅ 레거시 Java 소스
│   ├── dao/                → DAO 계층 (180개 파일)
│   └── malgnsoft/          → 유틸리티
│
├── web/                    ✅ 웹 리소스
│   └── WEB-INF/web.xml     → 서블릿 설정
│
├── docs/                   ✅ SQL 문서
│   └── sql/                → 추가 스크립트
│
└── .gitignore              ✅ Git 설정
```

---

## 📦 복사 결과

### 통계
- **총 크기**: ~4.3 MB (원본의 약 5%)
- **제외된 항목**: 로그 파일, 빌드 산출물, node_modules
- **복사 완료 시간**: 2026-02-01 17:02

### 폴더별 상세
| 폴더 | 파일 수 | 설명 |
|------|---------|------|
| **polytech-lms-api** | 183개 | Spring Boot API, SQL 스크립트 |
| **project** | 105개 | React 컴포넌트, Vite 설정 |
| **src** | 180개 | 레거시 DAO 클래스 |
| **web** | 2개 | WEB-INF 설정 |
| **docs** | 3개 | SQL 문서 |

---

## 🔧 빌드 명령어

### 1. 백엔드 (Spring Boot API)

#### Windows
```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean\polytech-lms-api

# 빌드
.\gradlew.bat clean build

# 실행
.\gradlew.bat bootRun
```

#### Mac/Linux
```bash
cd polytech-lms-api

# 빌드
./gradlew clean build

# 실행
./gradlew bootRun
```

#### 빌드 산출물
- 위치: `polytech-lms-api/build/libs/`
- 파일: `polytech-lms-api-0.0.1-SNAPSHOT.jar`

---

### 2. 프론트엔드 (React + Vite)

```powershell
cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean\project

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

#### 개발 서버
- URL: http://localhost:5173
- Hot Module Replacement (HMR) 활성화

#### 빌드 산출물
- 위치: `project/dist/`
- 정적 파일 생성됨

---

## ✅ 빌드 전 체크리스트

### 백엔드 요구사항
- [ ] **Java 17** 이상 설치
  ```bash
  java -version
  ```
- [ ] **환경 변수** 설정 (필요시)
  - `application.yml`에서 데이터베이스 연결 정보 확인

### 프론트엔드 요구사항
- [ ] **Node.js 18** 이상 설치
  ```bash
  node --version
  npm --version
  ```

---

## 🗄️ 데이터베이스 설정

### SQL 스크립트 위치
1. **백엔드**: `polytech-lms-api/sql/`
   - `TB_KOLLUS_TRANSCRIPT.sql`
   - `TB_RECO_CONTENT.sql`
   - `TB_JOB_CODE_TABLES.sql`
   - 기타 9개 파일

2. **문서**: `docs/sql/`
   - `job_bookmark.sql`
   - `job_search_log.sql`
   - `kollus_media.sql`

### 데이터베이스 초기화
```sql
-- MySQL/MariaDB 예시
mysql -u root -p < polytech-lms-api/sql/TB_KOLLUS_TRANSCRIPT.sql
mysql -u root -p < docs/sql/job_bookmark.sql
```

---

## 🔍 주요 파일 확인

### 백엔드 필수 파일
```bash
✅ polytech-lms-api/build.gradle
✅ polytech-lms-api/gradlew.bat
✅ polytech-lms-api/gradle/wrapper/gradle-wrapper.jar
✅ polytech-lms-api/src/main/java/kr/polytech/lms/PolytechLmsApiApplication.java
✅ polytech-lms-api/src/main/resources/application.yml
```

### 프론트엔드 필수 파일
```bash
✅ project/package.json
✅ project/vite.config.ts
✅ project/tsconfig.json
✅ project/index.html
✅ project/App.tsx
✅ project/main.tsx
```

### 웹 리소스 필수 파일
```bash
✅ web/WEB-INF/web.xml
```

---

## 🚨 문제 해결

### 백엔드 빌드 오류

#### 1. Java 버전 오류
```
> Task :compileJava FAILED
error: invalid source release: 17
```
**해결**: Java 17 설치
```bash
# Windows (Chocolatey)
choco install openjdk17

# Mac (Homebrew)
brew install openjdk@17
```

#### 2. Gradle 빌드 실패
```bash
# Gradle 캐시 삭제
rm -rf ~/.gradle/caches

# 또는 Windows
rd /s /q %USERPROFILE%\.gradle\caches

# 다시 빌드
.\gradlew.bat clean build --refresh-dependencies
```

#### 3. 데이터베이스 연결 오류
`polytech-lms-api/src/main/resources/application.yml` 확인:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lms_db
    username: root
    password: your_password
```

---

### 프론트엔드 빌드 오류

#### 1. Node.js 버전 오류
```
error Unsupported engine
```
**해결**: Node.js 18+ 설치
```bash
# Windows (nvm-windows)
nvm install 18
nvm use 18

# Mac/Linux (nvm)
nvm install 18
nvm use 18
```

#### 2. 의존성 설치 오류
```bash
# npm 캐시 삭제
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 3. Vite 빌드 오류
```bash
# Vite 캐시 삭제
rm -rf node_modules/.vite

# 재빌드
npm run build
```

---

## 📋 다음 단계

### 개발 환경 설정
1. IDE 설정
   - **IntelliJ IDEA**: Java 프로젝트 열기
   - **VS Code**: Extensions 설치 (Java, ESLint, Vite)

2. 환경 변수 설정
   ```bash
   # .env 파일 생성 (프론트엔드)
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. Git 초기화
   ```bash
   cd D:\Workspace\GrowAI_LMS\MalgnLMS-clean
   git init
   git add .
   git commit -m "Initial commit - clean build structure"
   ```

### 배포 준비
1. **백엔드**: JAR 파일 생성
   ```bash
   .\gradlew.bat bootJar
   ```

2. **프론트엔드**: 정적 파일 빌드
   ```bash
   npm run build
   ```

3. **통합**: Nginx 또는 Apache 설정

---

## 📚 참고 문서

### 기술 스택
- **백엔드**: Spring Boot 3.2.5, Java 17
- **프론트엔드**: React 18, Vite 6, TypeScript 5
- **빌드 도구**: Gradle 8.5, npm

### 관련 링크
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)

---

## ✅ 빌드 성공 확인

### 백엔드
```bash
.\gradlew.bat build

# 성공 메시지
BUILD SUCCESSFUL in 30s
```

### 프론트엔드
```bash
npm run build

# 성공 메시지
✓ built in 2.5s
```

---

**프로젝트가 즉시 빌드 가능한 상태로 준비되었습니다!** 🎉
