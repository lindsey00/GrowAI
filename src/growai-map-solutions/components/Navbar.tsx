import React, { useState } from 'react';
import { Menu, Zap, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../i18n/translations';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { name: '한국어', code: 'ko' as LanguageCode, flag: '🇰🇷' },
    { name: 'English', code: 'en' as LanguageCode, flag: '🇺🇸' },
    { name: '日本語', code: 'ja' as LanguageCode, flag: '🇯🇵' },
    { name: '中文 (简体)', code: 'zh-CN' as LanguageCode, flag: '🇨🇳' },
    { name: '中文 (繁體)', code: 'zh-TW' as LanguageCode, flag: '🇹🇼' },
    { name: 'Русский', code: 'ru' as LanguageCode, flag: '🇷🇺' },
    { name: 'Español', code: 'es' as LanguageCode, flag: '🇪🇸' },
    { name: 'Français', code: 'fr' as LanguageCode, flag: '🇫🇷' },
    { name: 'Deutsch', code: 'de' as LanguageCode, flag: '🇩🇪' },
    { name: 'Português', code: 'pt' as LanguageCode, flag: '🇵🇹' },
    { name: 'العربية', code: 'ar' as LanguageCode, flag: '🇸🇦' },
  ];

  const currentLangData = languages.find(l => l.code === language) || languages[0];

  const navLinks = [
    { label: t.nav.platform, href: '#platform' },
    { label: t.nav.solutions, href: '#solutions' },
    { label: t.nav.matching, href: '#expert-matcher' },
    { label: t.nav.references, href: '#testimonials' },
    { label: t.nav.lms, href: '#lms' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-main/80 backdrop-blur-xl animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="size-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Zap className="size-5 text-main fill-main" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">
              Grow<span className="text-primary">AI</span>-MAP
            </span>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 우측 액션 */}
          <div className="flex items-center gap-4">
            {/* 언어 선택 */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors px-2 py-1 rounded-md hover:bg-white/5"
              >
                <span className="text-base">{currentLangData.flag}</span>
                <span className="hidden sm:inline">{currentLangData.name}</span>
                <ChevronDown className={`size-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto py-2 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl animate-scale-in no-scrollbar">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                        language === lang.code ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 로그인/사용자 메뉴 */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-white">홍길동</span>
                  <ChevronDown className={`size-3 text-white transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl animate-scale-in">
                    <a
                      href="#profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>프로필</span>
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
                    >
                      <Settings className="w-4 h-4" />
                      <span>설정</span>
                    </a>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:block text-gray-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-primary text-main font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20 magnetic-hover"
                >
                  {t.nav.getStarted}
                </button>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white md:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-main/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-400 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
                >
                  {t.nav.login}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
