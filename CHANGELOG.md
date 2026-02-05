# GrowAI-MAP 개발 로그

## [2026-02-06] 파일 업로드 기능 구현

### 기능 개요
제조 AX 플랫폼을 위한 문서 파일 업로드 기능 구현 (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, HWP)

---

### Backend (Spring Boot 3.2.2)

#### 1. DTO 인터페이스 정의
| 파일 | 설명 |
|------|------|
| `dto/FileUploadResponse.java` | 파일 업로드 응답 DTO |
| `dto/FileListResponse.java` | 파일 목록 응답 DTO |
| `dto/FileDeleteResponse.java` | 파일 삭제 응답 DTO |

#### 2. Domain Entity
| 파일 | 설명 |
|------|------|
| `domain/FileInfo.java` | 업로드 파일 정보 Entity (JPA) |

**FileInfo 필드:**
- `fileId` (PK): UUID 형식 파일 식별자
- `fileName`: 저장된 파일명
- `originalFileName`: 원본 파일명
- `contentType`: MIME 타입
- `fileSize`: 파일 크기 (bytes)
- `filePath`: 물리 저장 경로
- `fileUrl`: API 접근 URL
- `status`: ACTIVE, DELETED, PROCESSING
- `uploadedBy`: 업로드 사용자
- `createdAt`, `updatedAt`: 타임스탬프

#### 3. Repository
| 파일 | 설명 |
|------|------|
| `repository/FileInfoRepository.java` | JPA Repository 인터페이스 |

#### 4. Service
| 파일 | 설명 |
|------|------|
| `service/FileUploadService.java` | 파일 업로드 비즈니스 로직 |

**주요 기능:**
- `uploadFile()`: 단일 파일 업로드
- `uploadFiles()`: 다중 파일 업로드
- `getFileList()`: 파일 목록 조회
- `deleteFile()`: 파일 삭제 (소프트 삭제)
- `getFileInfo()`: 파일 정보 조회

**파일 검증:**
- 허용 확장자: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, hwp
- 최대 파일 크기: 50MB (설정 가능)
- 날짜별 디렉토리 저장 (yyyy/MM/dd)

#### 5. Controller
| 파일 | 설명 |
|------|------|
| `controller/FileUploadController.java` | REST API 컨트롤러 |

**API 엔드포인트:**
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/upload` | 단일 파일 업로드 |
| POST | `/api/upload/multiple` | 다중 파일 업로드 |
| GET | `/api/files` | 파일 목록 조회 |
| GET | `/api/files/{fileId}` | 파일 다운로드 |
| DELETE | `/api/files/{fileId}` | 파일 삭제 |

#### 6. 설정 파일 수정
| 파일 | 변경 내용 |
|------|-----------|
| `application-dev.yml` | 파일 업로드 설정, Multipart 설정 추가 |

**추가된 설정:**
```yaml
file:
  upload:
    path: ./uploads
    max-size: 52428800  # 50MB
    base-url: /api/files

spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 50MB
      max-request-size: 100MB
```

#### 7. Mock 데이터
| 파일 | 설명 |
|------|------|
| `resources/data.sql` | 개발용 샘플 파일 데이터 3건 |

---

### Frontend (React + TypeScript + Vite)

#### 1. 컴포넌트
| 파일 | 설명 |
|------|------|
| `components/FileUpload.tsx` | 파일 업로드 컴포넌트 |
| `components/FileUpload.css` | 컴포넌트 스타일링 |

**FileUpload 기능:**
- 드래그앤드롭 파일 추가
- 파일 선택 버튼
- 파일 목록 표시 (아이콘, 이름, 크기)
- 개별 파일 삭제
- 전체 삭제
- 업로드 진행률 표시
- 파일 유효성 검사 (확장자, 크기)

#### 2. 페이지
| 파일 | 설명 |
|------|------|
| `pages/FileUploadPage.tsx` | 파일 업로드 페이지 |
| `pages/FileUploadPage.css` | 페이지 스타일링 |

#### 3. API 서비스
| 파일 | 설명 |
|------|------|
| `services/fileUploadApi.ts` | 백엔드 API 연동 |

**인터페이스:**
- `FileUploadResponse`: 업로드 응답
- `FileListResponse`: 목록 응답
- `FileItem`: 파일 아이템
- `FileDeleteResponse`: 삭제 응답
- `FileUploadOptions`: 업로드 옵션

**함수:**
- `uploadFile()`: 단일 파일 업로드
- `uploadMultipleFiles()`: 다중 파일 업로드
- `getFileList()`: 파일 목록 조회
- `getFileDownloadUrl()`: 다운로드 URL 생성
- `deleteFile()`: 파일 삭제

#### 4. App 수정
| 파일 | 변경 내용 |
|------|-----------|
| `App.tsx` | FileUploadPage import, 네비게이션 추가 |
| `App.css` | 네비게이션 스타일 추가 |

---

### 실행 방법

**Backend:**
```bash
cd D:\Workspace\GrowAI-MAP_260130\GrowAI-MAP\backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

**Frontend:**
```bash
cd D:\Workspace\GrowAI-MAP_260130\GrowAI-MAP\frontend
npm run dev
```

**접속:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

---

### 파일 구조

```
GrowAI-MAP/
├── backend/
│   └── src/main/java/com/newcle/growaimap/
│       ├── controller/
│       │   └── FileUploadController.java     [NEW]
│       ├── domain/
│       │   └── FileInfo.java                 [NEW]
│       ├── dto/
│       │   ├── FileUploadResponse.java       [NEW]
│       │   ├── FileListResponse.java         [NEW]
│       │   └── FileDeleteResponse.java       [NEW]
│       ├── repository/
│       │   └── FileInfoRepository.java       [NEW]
│       └── service/
│           └── FileUploadService.java        [NEW]
│   └── src/main/resources/
│       ├── application-dev.yml               [MODIFIED]
│       └── data.sql                          [NEW]
│
└── frontend/
    └── src/
        ├── components/
        │   ├── FileUpload.tsx                [NEW]
        │   └── FileUpload.css                [NEW]
        ├── pages/
        │   ├── FileUploadPage.tsx            [NEW]
        │   └── FileUploadPage.css            [NEW]
        ├── services/
        │   └── fileUploadApi.ts              [NEW]
        ├── App.tsx                           [MODIFIED]
        └── App.css                           [MODIFIED]
```

---

### 다음 단계 (TODO)

1. [ ] 파일 업로드 권한 체크 (JWT 토큰 연동)
2. [ ] 파일 미리보기 기능
3. [ ] 업로드 파일 분석 AI 연동
4. [ ] 파일 버전 관리
5. [ ] 대용량 파일 청크 업로드
