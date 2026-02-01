# MalgnLMS - 학습 관리 시스템

> 즉시 빌드 가능한 클린 버전

## 🎯 프로젝트 개요

폴리텍 LMS(Learning Management System) - Spring Boot + React 기반 학습 관리 플랫폼

---

## 🏗️ 프로젝트 구조

```
MalgnLMS-clean/
├── polytech-lms-api/    # Spring Boot 백엔드 API
├── project/             # React 프론트엔드
├── src/                 # 레거시 Java DAO
├── web/                 # 웹 리소스
└── docs/                # SQL 문서
```

---

## 🚀 빠른 시작

### 백엔드 실행

```bash
cd polytech-lms-api
.\gradlew.bat bootRun
```

### 프론트엔드 실행

```bash
cd project
npm install
npm run dev
```

---

## 📋 요구사항

- **Java**: 17 이상
- **Node.js**: 18 이상
- **MySQL/MariaDB**: 8.0 이상

---

## 📖 상세 문서

빌드 및 배포 가이드는 [BUILD_GUIDE.md](BUILD_GUIDE.md)를 참조하세요.

---

## 📊 기술 스택

### 백엔드
- Spring Boot 3.2.5
- Java 17
- Gradle 8.5
- MySQL

### 프론트엔드
- React 18
- TypeScript 5
- Vite 6
- Tailwind CSS 4

---

## 🔧 개발

### 백엔드 빌드
```bash
.\gradlew.bat clean build
```

### 프론트엔드 빌드
```bash
npm run build
```

---

## 📁 주요 디렉토리

| 디렉토리 | 설명 |
|----------|------|
| `polytech-lms-api/src/main/java` | Java 소스 코드 |
| `polytech-lms-api/sql` | 데이터베이스 스키마 |
| `project/components` | React 컴포넌트 |
| `src/dao` | 레거시 DAO 클래스 |
| `docs/sql` | 추가 SQL 스크립트 |

---

## 📝 라이선스

Copyright © 2026 Polytech LMS

---

## 👥 기여

이 프로젝트는 폴리텍 LMS 팀에 의해 관리됩니다.

---

**Happy Coding! 🎉**
