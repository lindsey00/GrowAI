
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Radio } from 'lucide-react';

const data = [
  { time: '06:00', value: 65 },
  { time: '08:00', value: 80 },
  { time: '10:00', value: 75 },
  { time: '12:00', value: 92 },
  { time: '14:00', value: 85 },
  { time: '16:00', value: 94.2 },
  { time: '18:00', value: 70 },
  { time: '20:00', value: 88 },
  { time: '22:00', value: 91 },
  { time: '00:00', value: 94.2 },
];

const LiveDashboardPreview: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Real-time ROI Tracking</h2>
          <p className="text-gray-400 max-w-md">Enterprise-grade manufacturing intelligence powered by predictive modeling.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
          <Radio className="size-4 text-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Syncing</span>
        </div>
      </div>

      <div className="rounded-3xl bg-surface border border-primary/20 p-8 shadow-2xl shadow-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-white font-mono text-6xl font-bold tracking-tighter">94.2%</span>
              <span className="text-green-400 text-sm font-bold">+12.4% vs last shift</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141417', borderColor: '#222222', borderRadius: '12px' }}
                    itemStyle={{ color: '#00D4FF', fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00D4FF" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-12 pt-12 lg:pt-0">
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Line Speed</p>
              <p className="text-white text-2xl font-bold font-mono tracking-tight">1,240 <span className="text-xs font-normal text-gray-500">u/hr</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Yield Ratio</p>
              <p className="text-white text-2xl font-bold font-mono tracking-tight">0.994</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Uptime</p>
              <p className="text-white text-2xl font-bold font-mono tracking-tight">23h 14m</p>
            </div>
            <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboardPreview;
