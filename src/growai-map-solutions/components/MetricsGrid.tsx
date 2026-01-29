
import React from 'react';
import { TrendingUp, Clock, Target, Gauge } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const MetricsGrid: React.FC = () => {
  const { t } = useLanguage();
  
  const metrics = [
    {
      label: t.metrics.efficiency,
      value: '30%',
      change: t.metrics.efficiencyChange,
      icon: <TrendingUp className="text-green-400" />,
      positive: true
    },
    {
      label: t.metrics.payback,
      value: '14 Mo.',
      change: t.metrics.paybackChange,
      icon: <Clock className="text-primary" />,
      positive: true
    },
    {
      label: t.metrics.accuracy,
      value: '99.9%',
      change: t.metrics.accuracyChange,
      icon: <Gauge className="text-primary" />,
      positive: true
    },
    {
      label: t.metrics.scrap,
      value: '22%',
      change: t.metrics.scrapChange,
      icon: <Target className="text-red-400" />,
      positive: false
    }
  ];

  return (
    <div className="space-y-12">
      {/* Section header with slide-in animation */}
      <div className="text-center md:text-left animate-slide-in-left">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{t.metrics.title}</h2>
        <p className="text-gray-400 max-w-xl">
          {t.metrics.description}
        </p>
      </div>

      {/* Metrics cards with staggered 3D animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-2xl bg-surface border border-white/5 relative group hover:border-primary/30 transition-all card-3d animate-scale-in delay-${(i + 1) * 100} overflow-hidden`}
            style={{ animationDelay: `${(i + 2) * 0.1}s` }}
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Icon with float animation */}
            <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:animate-float">
              {React.cloneElement(metric.icon as React.ReactElement, { className: 'size-5' })}
            </div>
            
            {/* Metric content */}
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10">{metric.label}</p>
            <p className="text-white text-3xl font-mono font-bold tracking-tighter mb-2 relative z-10 counter-animate" style={{ animationDelay: `${(i + 3) * 0.1}s` }}>
              {metric.value}
            </p>
            <p className={`text-[11px] font-bold relative z-10 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
