@echo off
chcp 65001
setlocal enabledelayedexpansion

:: 1. 환경 설정
set PROJECT_ROOT=D:\WorkSpace\GrowAI-MAP
set LOG_FILE=%PROJECT_ROOT%\build_log.txt
set ERROR_FILE=%PROJECT_ROOT%\error_report.txt

echo [빌드 시작] %date% %time% > "%LOG_FILE%"
echo ======================================================
echo   GrowAI-MAP Agentic AI Build Bot v1.0
echo ======================================================

:: 2. 폴더 구조 생성
echo [1/4] 프로젝트 구조 생성 중...
mkdir "%PROJECT_ROOT%\scripts" "%PROJECT_ROOT%\src\backend" "%PROJECT_ROOT%\src\frontend" "%PROJECT_ROOT%\src\database" 2>nul

:: 3. 구성 요소 생성 (성공/실패 체크 로직)
call :run_step "환경 변수 생성" "scripts\gen_env.bat"
call :run_step "백엔드 코드 생성" "scripts\gen_backend.bat"
call :run_step "프론트엔드 코드 생성" "scripts\gen_frontend.bat"
call :run_step "DB/데이터 생성" "scripts\gen_data.bat"

:: 4. 빌드 결과 분석 (Agentic AI 루틴)
findstr /C:"FAILED" "%LOG_FILE%" >nul
if %errorlevel% equ 0 (
    echo [경고] 일부 빌드 중 오류가 발견되었습니다. Agentic AI 분석을 시작합니다...
    echo --- 에러 분석 리포트 --- > "%ERROR_FILE%"
    type "%LOG_FILE%" | findstr /C:"FAILED" >> "%ERROR_FILE%"
    
    :: Gemini CLI를 이용한 자가 진단 및 수정 제안
    gemini "다음 빌드 로그의 에러 내용을 분석하고 초보 개발자가 수정할 수 있는 구체적인 명령어를 제안해줘: " + type "%ERROR_FILE%" >> "%ERROR_FILE%"
    
    echo [완료] 분석 보고서가 생성되었습니다: %ERROR_FILE%
    notepad "%ERROR_FILE%"
) else (
    echo [성공] 모든 모듈이 정상적으로 빌드되었습니다.
    echo [결과] %PROJECT_ROOT% 디렉토리를 확인하세요.
)
pause
exit

:run_step
echo [%~1] 실행 중...
call %~2 >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo [FAILED] %~1 단계에서 오류 발생 >> "%LOG_FILE%"
    exit /b 1
)
echo [SUCCESS] %~1 완료 >> "%LOG_FILE%"
goto :eof