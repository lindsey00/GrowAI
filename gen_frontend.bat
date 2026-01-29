@echo off
chcp 65001
cls

set TARGET_DIR=D:\WorkSpace\GrowAI-MAP\src\frontend\components
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [진행 중] 프론트엔드 React 차트 컴포넌트 생성...

gemini "Next.js와 Recharts를 사용하여 제조 수율 대시보드(Dashboard.tsx)를 작성해줘.
내용에는 다음을 포함해:
1. Recharts의 LineChart를 이용한 실시간 데이터 시각화.
2. 각 함수와 Props에 대한 상세한 한글 주석.
3. 주석 상단에 '배경지식: React Hooks와 데이터 시각화', '연관항목: Tailwind CSS 레이아웃', '학습 사이트: https://recharts.org/' 내용을 포함할 것.
4. 초보자가 이해하기 쉽게 변수명을 직관적으로 지어줘." > "%TARGET_DIR%\Dashboard.tsx"

echo [완료] 프론트엔드 소스가 %TARGET_DIR%\Dashboard.tsx 에 생성되었습니다.
pause