import React, { useState } from 'react';
import { ArrowRight, Factory, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import BookingPage from './BookingPage';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  return (
    <>
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full animate-pulse-glow"></div>
        
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 shadow-lg shadow-primary/10 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t.hero.badge}</span>
          </div>

          {/* Main Title - GrowAI-MAP */}
          <div className="space-y-3 animate-fade-in-up delay-100">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                {t.hero.title1}
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-400 tracking-wide">
              {t.hero.title2}
            </p>
            <p className="text-lg text-gray-500 font-medium">
              {t.hero.subtitle}
            </p>
          </div>

          {/* 3가지 핵심 가치 - 깔끔한 카드 형식 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl animate-fade-in-up delay-200">
            <div className="group bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all card-3d">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition">
                  <Factory className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white">{t.hero.value1}</h3>
              </div>
            </div>

            <div className="group bg-surface border border-border rounded-xl p-6 hover:border-secondary/50 transition-all card-3d">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center group-hover:scale-110 transition">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-white">{t.hero.value2}</h3>
              </div>
            </div>

            <div className="group bg-surface border border-border rounded-xl p-6 hover:border-green-500/50 transition-all card-3d">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold text-white">{t.hero.value3}</h3>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed animate-fade-in-up delay-300">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fade-in-up delay-400">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="group w-full sm:w-auto min-w-[280px] h-14 px-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-base flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-primary/30 magnetic-hover"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
              {t.hero.bookBriefing}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button className="w-full sm:w-auto min-w-[200px] px-8 h-14 rounded-full border-2 border-border text-white font-bold hover:border-primary/50 hover:bg-primary/5 transition-all magnetic-hover">
              {t.hero.viewSolutions}
            </button>
          </div>

          {/* 신뢰 지표 */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-500 animate-fade-in-up delay-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>500+ 도입 기업</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>98% 고객 만족도</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>평균 ROI 245%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 예약 페이지 모달 */}
      <BookingPage 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
};

export default Hero;
