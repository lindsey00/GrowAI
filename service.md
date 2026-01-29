GrowAI-MAP (Manufacturing Analysis & Prediction) 
서비스 개발을 위한 세부 태스크 목록을 생성했습니다. 
이 목록은 구글의 AI 기반 개발 도구인 Anti-Gravity를 활용한 고효율 개발 프로세스를 전제로 하며, 
각 단계는 독립적으로 실행 가능하도록 세분화되었습니다.

[Task List] GrowAI-MAP 플랫폼 개발 태스크1. 인프라 및 개발 환경 설정 (Infrastructure & Setup)
[ ] 구글 Anti-Gravity 개발 환경 구축 및 프로젝트 초기화
[ ] GCP(Google Cloud Platform) 프로젝트 설정 및 Vertex AI / BigQuery API 활성화
[ ] PostgreSQL(사용자 및 기본 데이터) 및 Vector Database(파트너사 기술 스펙) 아키텍처 설계
[ ] BOONGTOO 확장을 고려한 결제 및 구독 데이터베이스 스키마 설계
2. 데이터 분석 및 진단 엔진 (Diagnosis & Data Engine)
[ ] '제조 5대 고민 모델' 기반 자가진단 로직 구현 (Backend API)
[ ] 설비 로그 데이터(CSV/JSON) 업로드 파서 및 기초 통계 분석 모듈 개발
[ ] Vertex AI 기반 제조 데이터 정밀 진단 에이전트 개발
[ ] 진단 결과 기반 '현황 분석 리포트' 자동 생성 엔진(PDF Export 포함) 구축
3. ROI & ESG 시뮬레이터 (The Closer Module)
[ ] Standard vs Custom ROI 산출 공식 엔진 개발 (인건비, 불량률 변수)
[ ] 탄소 배출량 및 에너지 효율 지표 반영 ESG 시뮬레이션 알고리즘 구현
[ ] 커스텀 SI 견적 산출기 개발 (고정 요율형 / Man-Month형 선택 옵션)
[ ] 실시간 차트 렌더링을 위한 인터랙티브 데이터 바인딩 (Frontend)
4. 지능형 파트너 매칭 및 전문가 도구 (Expert Tools)
[ ] 6대 가중치(레퍼런스, 가격, 위치, 성숙도, 유지보수, 서비스) 기반 매칭 알고리즘 구현
[ ] 파트너사 기술 문서 RAG(Retrieval-Augmented Generation) 시스템 구축
[ ] 컨설턴트용 기술 대응 AI 챗봇 인터페이스 개발
[ ] 레퍼런스 팩토리(성공 사례 DB) 검색 및 호출 기능 개발
5. 사용자 인터페이스 개발 (UI/UX)
[ ] [관리자/PC] 전체 대시보드 및 파트너사 DB 관리 시스템 개발
[ ] [컨설턴트/Tablet] 현장 전용 인터랙티브 자가진단 및 시뮬레이션 웹 UI 개발
[ ] [공용] GrowAI LMS 내재화(Embedded)를 위한 학습 환경 통합 레이아웃 개발
6. 통합 및 운영 고도화 (Integration & QA)
[ ] 플랫폼 내 GrowAI LMS 보안 토큰 기반 SSO(Single Sign-On) 연동
[ ] 전체 시스템 통합 테스트 및 시뮬레이션 로직 검증
[ ] 구글 클라우드 기반 CI/CD 파이프라인 구축 및 서버리스(Cloud Run) 배포
[ ] 운영 관리용 트렌드 인사이트 리포트 대시보드 최종 점검