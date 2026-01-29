import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Zap, AlertCircle } from 'lucide-react';

interface RealtimeMetric {
  timestamp: string;
  temperature: number;
  pressure: number;
  vibration: number;
  power: number;
  production_count: number;
  defect_count: number;
}

const TimeSeriesChart: React.FC = () => {
  const [data, setData] = useState<RealtimeMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'temperature' | 'production' | 'power' | 'all'>('all');

  useEffect(() => {
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 5000); // 5초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/realtime/metrics');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch realtime data:', err);
      // 폴백: 로컬 Mock 데이터 생성
      generateMockData();
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: RealtimeMetric[] = [];
    const now = new Date();
    
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000);
      mockData.push({
        timestamp: timestamp.toISOString(),
        temperature: Math.random() * 30 + 50,
        pressure: Math.random() * 2 + 2,
        vibration: Math.random() * 1.5 + 0.5,
        power: Math.random() * 20 + 30,
        production_count: Math.floor(Math.random() * 50 + 80),
        defect_count: Math.floor(Math.random() * 3)
      });
    }
    setData(mockData);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = data.map(d => ({
    time: formatTime(d.timestamp),
    온도: d.temperature.toFixed(1),
    압력: d.pressure.toFixed(1),
    진동: d.vibration.toFixed(2),
    전력: d.power.toFixed(1),
    생산량: d.production_count,
    불량: d.defect_count
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Real-time Monitoring</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">
          실시간 시계열 데이터 분석
        </h2>
        <p className="text-gray-400">
          최근 20분간의 센서 데이터 추이
        </p>
      </div>

      {/* 차트 선택 탭 */}
      <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up delay-100">
        {[
          { id: 'all', label: '전체 보기', icon: TrendingUp },
          { id: 'temperature', label: '온도 분석', icon: Activity },
          { id: 'production', label: '생산 현황', icon: Zap },
          { id: 'power', label: '전력 소비', icon: AlertCircle }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveChart(id as any)}
            className={`px-6 py-3 rounded-lg border transition magnetic-hover flex items-center gap-2 ${
              activeChart === id
                ? 'bg-primary text-main border-primary'
                : 'bg-surface border-border hover:border-primary/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 gap-6 animate-fade-in-up delay-200">
        {/* 온도 & 압력 차트 */}
        {(activeChart === 'all' || activeChart === 'temperature') && (
          <div className="bg-surface border border-border rounded-xl p-6 card-3d">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              온도 & 압력 추이
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="온도"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ fill: '#00D4FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="압력"
                  stroke="#2b6cee"
                  strokeWidth={2}
                  dot={{ fill: '#2b6cee', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 생산량 & 불량 차트 */}
        {(activeChart === 'all' || activeChart === 'production') && (
          <div className="bg-surface border border-border rounded-xl p-6 card-3d">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              생산량 & 불량 현황
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="생산량" fill="#00D4FF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="불량" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 전력 소비 차트 */}
        {(activeChart === 'all' || activeChart === 'power') && (
          <div className="bg-surface border border-border rounded-xl p-6 card-3d">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              전력 소비 & 진동 분석
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="전력"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="진동"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 실시간 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-300">
        {[
          { label: '평균 온도', value: (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1), unit: '°C', color: 'text-primary' },
          { label: '평균 압력', value: (data.reduce((sum, d) => sum + d.pressure, 0) / data.length).toFixed(1), unit: 'bar', color: 'text-blue-500' },
          { label: '총 생산량', value: data.reduce((sum, d) => sum + d.production_count, 0).toString(), unit: '개', color: 'text-green-500' },
          { label: '총 불량', value: data.reduce((sum, d) => sum + d.defect_count, 0).toString(), unit: '개', color: 'text-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary/50 transition">
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-sm ml-1">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
