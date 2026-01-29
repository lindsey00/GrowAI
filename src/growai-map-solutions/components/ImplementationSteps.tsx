
import React from 'react';
import { Search, Calculator, Rocket } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ImplementationSteps: React.FC = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      num: '01',
      title: t.implementation.step1Title,
      desc: t.implementation.step1Desc,
      icon: <Search />
    },
    {
      num: '02',
      title: t.implementation.step2Title,
      desc: t.implementation.step2Desc,
      icon: <Calculator />
    },
    {
      num: '03',
      title: t.implementation.step3Title,
      desc: t.implementation.step3Desc,
      icon: <Rocket />
    }
  ];

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">{t.implementation.title}</h2>
        <p className="text-gray-400 max-w-xl mx-auto">{t.implementation.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative p-8 rounded-3xl bg-surface border border-white/5 group hover:border-primary/20 transition-all">
            <div className="absolute top-8 right-8 text-primary/10 font-mono text-5xl font-black">{step.num}</div>
            <div className="size-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              {React.cloneElement(step.icon as React.ReactElement, { className: 'size-7' })}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
            
            <div className="mt-8 flex gap-1.5">
              <div className={`h-1 w-8 rounded-full ${i >= 0 ? 'bg-primary' : 'bg-white/10'}`}></div>
              <div className={`h-1 w-8 rounded-full ${i >= 1 ? 'bg-primary' : 'bg-white/10'}`}></div>
              <div className={`h-1 w-8 rounded-full ${i >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImplementationSteps;
