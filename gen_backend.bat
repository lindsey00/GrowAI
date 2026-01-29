@echo off
chcp 65001
cls

set TARGET_DIR=D:\WorkSpace\GrowAI-MAP\src\backend
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [진행 중] 백엔드 FastAPI 소스 코드 생성...

gemini "FastAPI를 사용하여 제조 데이터 API 서버(main.py)를 작성해줘. 
내용에는 다음을 포함해:
1. 설비 온도와 진동 데이터를 받는 POST 엔드포인트.
2. 모든 코드 라인에 초보자를 위한 상세한 한글 주석.
3. 주석 상단에 '배경지식: REST API와 FastAPI', '연관항목: Pydantic 모델링', '학습 사이트: https://fastapi.tiangolo.com/ko/' 내용을 포함할 것.
4. 한글이 깨지지 않도록 UTF-8로 작성." > "%TARGET_DIR%\main.py"

echo [완료] 백엔드 소스가 %TARGET_DIR%\main.py 에 생성되었습니다.
pause