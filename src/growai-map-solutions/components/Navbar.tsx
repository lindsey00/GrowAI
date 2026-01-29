import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.platform, href: '#platform' },
    { label: t.nav.solutions, href: '#solutions' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <a href="/" className="group relative">
              <div className="flex items-baseline gap-0 transition-all duration-700">
                {/* GrowA Text */}
                <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                  GrowA
                </span>
                
                {/* i with Star on top */}
                <div className="relative inline-flex flex-col items-center">
                  {/* Star Icon - positioned above i */}
                  <svg className="w-3 h-3 text-cyan-400 absolute -top-3 group-hover:scale-125 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  {/* i stem */}
                  <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                    I
                  </span>
                </div>

                {/* -MAP Text */}
                <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                  -MAP
                </span>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-400/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-cyan-400/20 group-hover:to-blue-500/20 blur-xl transition-all duration-700 rounded-lg -z-10"></div>
            </a>

          {/* Center Section - Navigation Menu */}
          <div className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group relative px-4 py-2 transition-all duration-500"
              >
                <span className="text-base font-bold tracking-wider uppercase text-cyan-400/80 group-hover:text-cyan-400 transition-colors duration-500">
                  {item.label}
                </span>
                {/* Underline effect */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-400/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-400/10 group-hover:to-blue-500/10 blur-lg transition-all duration-500 -z-10"></div>
              </a>
            ))}
          </div>

          {/* Right Section - Language & CTA */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <a
              href="#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-black tracking-wider uppercase rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            >
              {t.nav.getStarted}
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          {/* Mobile Logo */}
          <a href="/" className="group relative">
            <div className="flex items-baseline gap-0 transition-all duration-700">
              {/* GrowA Text */}
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                GrowA
              </span>
              
              {/* i with Star on top */}
              <div className="relative inline-flex flex-col items-center">
                {/* Star Icon */}
                <svg className="w-2 h-2 text-cyan-400 absolute -top-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {/* i stem */}
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                  I
                </span>
              </div>

              {/* -MAP Text */}
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                -MAP
              </span>
            </div>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6 space-y-3">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-bold tracking-wider uppercase text-cyan-400/70 hover:text-cyan-400 transition-all duration-500"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-black tracking-wider uppercase rounded-full text-center transition-all duration-500"
            >
              {t.nav.getStarted}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
