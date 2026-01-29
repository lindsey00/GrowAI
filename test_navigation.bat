@echo off
echo ========================================
echo GrowAI-MAP Navigation Test
echo ========================================
echo.
echo Testing navigation features...
echo.
echo 1. Opening browser at http://localhost:3001/
echo.
echo Please manually test the following:
echo.
echo [Navbar]
echo - Logo (GrowAI-MAP) displayed
echo - 6 navigation links displayed
echo - Language selector (Korean flag)
echo - Login button
echo - Get Started button
echo.
echo [Navigation Links]
echo - Click "플랫폼" → scroll to #platform
echo - Click "솔루션" → scroll to #solutions
echo - Click "전문가 매칭" → scroll to #expert-matcher
echo - Click "성공 사례" → scroll to #testimonials
echo - Click "학습 센터" → scroll to #lms
echo - Click "문의하기" → scroll to #contact
echo.
echo [Smooth Scroll]
echo - Verify smooth scrolling animation
echo - Verify scroll offset (scroll-mt-20)
echo.
echo [Language Selector]
echo - Click language dropdown
echo - Verify 11 languages displayed
echo - Test language switching
echo.
echo [Login Modal]
echo - Click "로그인" button
echo - Verify modal opens
echo - Test login form
echo - Test signup form
echo - Test social login buttons
echo.
echo [ChatBot]
echo - Verify floating button (bottom right)
echo - Click to open chatbot
echo - Type message and press Enter
echo - Verify bot response
echo - Test minimize/maximize
echo.
echo [Mobile Menu]
echo - Resize browser to < 768px
echo - Verify hamburger menu appears
echo - Click to open mobile menu
echo - Verify all links displayed
echo.
echo ========================================
echo Opening browser...
echo ========================================
echo.
start http://localhost:3001/
echo.
echo Browser opened! Please follow the test checklist above.
echo.
echo Press any key to exit...
pause > nul
