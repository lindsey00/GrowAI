import React, { useState } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import BookingPage from './BookingPage';

const CTASection: React.FC = () => {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  return (
    <>
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-primary via-secondary to-primary/80 p-1 bg-size-200 animate-gradient overflow-hidden shadow-2xl shadow-primary/20">
        <div className="bg-main rounded-[2.4rem] p-10 md:p-20 text-center space-y-10 relative">
          <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="size-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Efficiency Audit</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter">
              {t.cta.title}
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
              {t.cta.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary text-main font-black px-12 py-5 rounded-full text-xl shadow-xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {t.cta.button}
            </button>
            <p className="text-gray-500 text-sm font-bold flex items-center gap-2">
              <Calendar className="size-4" />
              No credit card required • 30-minute expert session
            </p>
          </div>
        </div>
      </div>

      {/* 예약 페이지 모달 */}
      <BookingPage 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
};

export default CTASection;
