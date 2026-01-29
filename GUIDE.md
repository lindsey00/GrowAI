# 🚀 GrowAI-MAP: AI 기반 제조 통합 플랫폼 구축 가이드

본 문서는 Gemini CLI와 자동화 봇을 활용하여 **GrowAI-MAP** 프로젝트를 구축하고 유지보수하기 위한 마스터 가이드입니다.

---

## 1. 프로젝트 정의 및 비전
> **GrowAI-MAP**은 제조 현장의 데이터를 수집, 분석하고 AI 모델을 활용하여 생산 효율성을 극대화하기 위한 제조 AI 통합 플랫폼입니다.



---

## 2. 프로젝트 구조 (System Architecture)

| 디렉토리 경로 | 역할 및 구성 요소 | 비고 |
| :--- | :--- | :--- |
| `scripts/` | Gemini CLI 제어 및 빌드 자동화 스크립트 | 관리 도구 |
| `src/backend/` | FastAPI 기반 비동기 API 서버 | AI 추론 엔진 |
| `src/frontend/` | Next.js 14 대시보드 및 시각화 | 사용자 인터페이스 |
| `src/database/` | PostgreSQL 스키마 및 고정밀 노이즈 데이터 | 데이터 레이어 |

---

## 3. Agentic AI Build Bot 핵심 로직 설명

초보 개발자도 시스템을 쉽게 이해할 수 있도록 빌드 봇에 적용된 주요 기술 개념을 설명합니다.

### ① 자동화 로직 (Automation)
* **개념:** 사람이 일일이 입력하던 `mkdir`, `gemini "..." > file` 명령어를 배치 파일(`.bat`)로 묶어 한 번에 실행합니다.
* **장점:** 인적 오류(Typo)를 방지하고 환경 구축 속도를 획기적으로 줄입니다.

### ② 에러 트래핑 및 자가 진단 (Self-Healing)
* **배경지식:** `errorlevel`은 윈도우 명령 실행 후 성공(0) 또는 실패(1 이상)를 알려주는 값입니다.
* **Agentic 기능:** 빌드 봇은 실패 시 단순히 중단되는 것이 아니라, 에러 로그를 긁어 **Gemini AI에게 "이거 왜 틀렸어? 어떻게 고쳐?"**라고 물어본 뒤 보고서를 작성합니다.

---

## 4. 소스 코드 구현 가이드 (초보자용 주석 예시)

모든 생성 소스 코드에는 아래와 같은 형식의 주석이 포함되어 학습을 돕습니다.

```python
# [배경지식] FastAPI의 @app.post는 HTTP POST 요청을 처리하는 '데코레이터'입니다.
# [연관항목] Pydantic을 사용한 데이터 유효성 검사 (Data Validation)
# [학습사이트] [https://fastapi.tiangolo.com/tutorial/body/](https://fastapi.tiangolo.com/tutorial/body/)
@app.post("/api/v1/sensor-data")
async def collect_data(data: SensorSchema):
    # 제조 현장의 센서 데이터를 비동기로 저장합니다.
    return {"status": "success"}