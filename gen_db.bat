@echo off
chcp 65001
cls

set TARGET_DIR=D:\WorkSpace\GrowAI-MAP\src\database
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [진행 중] PostgreSQL 스키마 설계서 생성...

gemini "제조 로그 저장을 위한 PostgreSQL 테이블 설계(schema.sql)를 작성해줘.
내용에는 다음을 포함해:
1. factory_id, sensor_value, timestamp 컬럼을 가진 테이블.
2. SQL 명령문 사이사이에 상세한 한글 설명 주석.
3. 주석 상단에 '배경지식: RDBMS와 시계열 데이터', '연관항목: Index 최적화', '학습 사이트: https://www.postgresql.org/docs/' 내용을 포함할 것." > "%TARGET_DIR%\schema.sql"

echo [완료] DB 스키마가 %TARGET_DIR%\schema.sql 에 생성되었습니다.
pause