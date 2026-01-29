import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 animate-grid-flow" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.4) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.4) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
      </div>

      {/* Gradient Orbs with Animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse-slow-reverse"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Main Heading with Powerful Animation */}
        <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
          <span className="block animate-slide-in-left">
            {t.hero.title1}
          </span>
          <span className="block mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-gradient-x animate-slide-in-right">
            {t.hero.title2}
          </span>
          <span className="block mt-4 animate-slide-in-left animation-delay-200">
            {t.hero.title3}
          </span>
        </h1>

        {/* Stats with Powerful Animation */}
        <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto mt-16 animate-fade-in-up animation-delay-800">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-500 hover:scale-110">
              <div className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-3 animate-count-up">
                99.8%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                {t.hero.accuracy}
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 hover:border-blue-400 transition-all duration-500 hover:scale-110">
              <div className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-3 animate-count-up animation-delay-200">
                40%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                {t.hero.costReduction}
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-500 hover:scale-110">
              <div className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-3 animate-count-up animation-delay-400">
                24/7
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                {t.hero.operation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          20% {
            opacity: 1;
            transform: translateX(0);
          }
          80% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100px);
          }
        }

        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          20% {
            opacity: 1;
            transform: translateX(0);
          }
          80% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100px);
          }
        }

        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(30px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slow-reverse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1);
          }
        }

        @keyframes pulse-button {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.8);
          }
        }

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

        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes count-up {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 6s ease-out infinite;
        }

        .animate-slide-in-right {
          animation: slide-in-right 6s ease-out infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 6s ease-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 6s ease-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 9s ease-in-out infinite;
        }

        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 9s ease-in-out infinite;
        }

        .animate-pulse-button {
          animation: pulse-button 7s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }

        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-count-up {
          animation: count-up 6s ease-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
