@echo off
echo ================================================================================
echo   MalgnLMS 서비스 시작
echo ================================================================================
echo.
echo Docker Desktop이 실행 중인지 확인하세요!
echo 시스템 트레이에서 Docker 아이콘이 초록색이어야 합니다.
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0verify-and-start.ps1"
pause
