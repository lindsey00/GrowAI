@echo off
chcp 65001 >nul
echo ================================
echo 🧪 GrowAI-MAP 브라우저 테스트
echo ================================
echo.

:: 현재 디렉토리 저장
set ORIGINAL_DIR=%CD%
set PROJECT_DIR=d:\WorkSpace\GrowAI-MAP\src\growai-map-solutions

echo [1/4] 프로젝트 디렉토리로 이동...
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
    echo ❌ 디렉토리 이동 실패: %PROJECT_DIR%
    pause
    exit /b 1
)
echo ✅ 디렉토리 이동 완료
echo.

echo [2/4] 의존성 확인...
if not exist "node_modules" (
    echo ⚠️  node_modules가 없습니다. npm install 실행 중...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install 실패
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules 존재
)
echo.

echo [3/4] 개발 서버 시작 중...
echo.
echo 📌 서버 정보:
echo    - Local:   http://localhost:3001/
echo    - Network: http://192.168.0.70:3001/
echo.
echo 💡 테스트 가이드: %ORIGINAL_DIR%\BROWSER_TEST_GUIDE.md
echo.
echo ⚠️  서버를 중지하려면 Ctrl+C를 누르세요
echo.
echo [4/4] 서버 실행...
echo ================================
echo.

:: 개발 서버 실행
call npm run dev

:: 서버 종료 시
echo.
echo ================================
echo 서버가 종료되었습니다.
echo ================================
pause
