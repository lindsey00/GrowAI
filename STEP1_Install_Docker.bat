@echo off
echo ================================================================================
echo   MalgnLMS Docker Desktop 설치
echo ================================================================================
echo.
echo 이 스크립트는 관리자 권한으로 실행되어야 합니다.
echo.
echo PowerShell 관리자 권한 창이 열립니다...
echo.
pause

powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"%~dp0install-docker.ps1\"' -Verb RunAs"
