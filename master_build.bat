@echo off
chcp 65001
setlocal enabledelayedexpansion

:: 프로젝트 루트 설정
set PROJECT_ROOT=D:\WorkSpace\GrowAI-MAP
cd /d "%PROJECT_ROOT%"

echo =======================================================
echo   GrowAI-MAP Google Native AI Toolchain Master Build
echo =======================================================

:: 1. 환경 변수 생성
call scripts\gen_env.bat

:: 2. 각 레이어별 코드 생성 (병렬 처리 가능하나 안정성을 위해 순차 실행)
echo [1/3] 백엔드 레이어 생성 중...
call scripts\gen_backend.bat

echo [2/3] 프론트엔드 레이어 생성 중...
call scripts\gen_frontend.bat

echo [3/3] 데이터베이스 레이어 생성 중...
call scripts\gen_db.bat

echo =======================================================
echo   프로젝트 빌드 완료! (D:\WorkSpace\GrowAI-MAP\src)
echo =======================================================
pause