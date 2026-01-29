import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface PlatformSectionProps {
  children: React.ReactNode;
}

const PlatformSection: React.FC<PlatformSectionProps> = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="platform" 
      className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-20">
          <span className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4 block">
            {t.platform.badge}
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            {t.platform.title}
            <br />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              {t.platform.subtitle}
            </span>
          </h2>
        </div>

        {children}
      </div>

      {/* Gradient Overlays */}
      <div 
        className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent pointer-events-none"
        style={{ opacity: 1 - scrollProgress * 0.5 }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none"
        style={{ opacity: 1 - scrollProgress * 0.5 }}
      ></div>

      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
          }
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PlatformSection;
