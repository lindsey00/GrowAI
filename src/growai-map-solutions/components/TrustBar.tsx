
import React from 'react';
import { ShieldCheck, Cpu, Factory, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const TrustBar: React.FC = () => {
  const { t } = useLanguage();
  
  const certifications = [
    { icon: <ShieldCheck />, label: 'ISO 27001' },
    { icon: <Cpu />, label: 'NIST AI' },
    { icon: <Factory />, label: 'IND 4.0' },
    { icon: <Award />, label: 'SOC2 TYPE II' }
  ];

  return (
    <div className="py-12 border-y border-white/5 bg-white/[0.01]">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-10">
        {t.trust.certified}
      </p>
      
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
        {certifications.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="text-white text-3xl">
              {React.cloneElement(item.icon as React.ReactElement, { className: 'size-8' })}
            </div>
            <span className="text-[10px] font-bold text-white tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
