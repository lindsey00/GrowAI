import React, { useEffect, useRef, useState } from 'react';
import { Brain, Eye, Zap, Shield, TrendingUp, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: string;
}

const TechnologySection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const features: Feature[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: t.technology.predictiveAI.title,
      description: t.technology.predictiveAI.description,
      stats: t.technology.predictiveAI.stats
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: t.technology.visionSystems.title,
      description: t.technology.visionSystems.description,
      stats: t.technology.visionSystems.stats
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t.technology.realtime.title,
      description: t.technology.realtime.description,
      stats: t.technology.realtime.stats
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.technology.security.title,
      description: t.technology.security.description,
      stats: t.technology.security.stats
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t.technology.learning.title,
      description: t.technology.learning.description,
      stats: t.technology.learning.stats
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: t.technology.edge.title,
      description: t.technology.edge.description,
      stats: t.technology.edge.stats
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="technology"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"
        style={{
          transform: `translateY(${scrollProgress * 200}px)`
        }}
      ></div>
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow-reverse"
        style={{
          transform: `translateY(${-scrollProgress * 200}px)`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-4xl mx-auto leading-relaxed">
            {t.technology.subtitle.split("'5대 고민'").length > 1 ? (
              <>
                {t.technology.subtitle.split("'5대 고민'")[0]}
                <span className="text-cyan-400 font-bold">{t.technology.fiveConcerns}</span>
                {t.technology.subtitle.split("'5대 고민'")[1].split('B2B 플랫폼')[0]}
                <span className="text-cyan-400 font-bold">{t.technology.b2bPlatform}</span>
                {t.technology.subtitle.split('B2B 플랫폼')[1]}
              </>
            ) : t.technology.subtitle.split("'5 key concerns'").length > 1 ? (
              <>
                {t.technology.subtitle.split("'5 key concerns'")[0]}
                <span className="text-cyan-400 font-bold">{t.technology.fiveConcerns}</span>
                {t.technology.subtitle.split("'5 key concerns'")[1].split('B2B platform')[0]}
                <span className="text-cyan-400 font-bold">{t.technology.b2bPlatform}</span>
                {t.technology.subtitle.split('B2B platform')[1]}
              </>
            ) : (
              t.technology.subtitle
            )}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div className="mb-6 text-blue-400 group-hover:text-cyan-400 transition-colors duration-300 group-hover:scale-110 transform">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Stats */}
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-blue-400 text-sm font-medium">
                  {feature.stats}
                </span>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-50px);
          }
        }

        @keyframes float-slow-reverse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(50px);
          }
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-float-slow-reverse {
          animation: float-slow-reverse 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TechnologySection;
