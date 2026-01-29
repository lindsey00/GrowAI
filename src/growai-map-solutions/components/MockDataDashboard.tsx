import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Database } from 'lucide-react';

interface DashboardStats {
  total_sensors: number;
  total_equipment: number;
  total_inspections: number;
  total_simulations: number;
  metrics: {
    anomaly_detection: {
      total_anomalies: number;
      anomaly_rate: number;
    };
    equipment_performance: {
      availability_percent: number;
      total_uptime_hours: number;
      total_downtime_hours: number;
    };
    quality_metrics: {
      defect_rate_percent: number;
      total_defects: number;
      pass_rate_percent: number;
    };
    roi_metrics: {
      average_roi_percent: number;
      total_investment: number;
      total_saving: number;
    };
  };
}

const MockDataDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Mock API 서버가 실행되지 않았습니다. python mock_api_server.py를 실행하세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Mock API 연결 실패</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-primary text-main rounded-lg hover:bg-primary/90 transition"
        >
          재시도
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
          <Database className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Live Mock Data Dashboard</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">
          실시간 제조 데이터 모니터링
        </h2>
        <p className="text-gray-400">
          총 {formatNumber(stats.total_sensors + stats.total_equipment + stats.total_inspections + stats.total_simulations)}개의 데이터 포인트
        </p>
      </div>

      {/* 주요 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 센서 데이터 */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition card-3d">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">{formatNumber(stats.total_sensors)}</span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">센서 데이터</h3>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">
              이상 감지: {stats.metrics.anomaly_detection.anomaly_rate}%
            </span>
          </div>
        </div>

        {/* 설비 가동률 */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition card-3d">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">
              {stats.metrics.equipment_performance.availability_percent.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">설비 가동률</h3>
          <div className="text-sm text-gray-500">
            총 {formatNumber(stats.total_equipment)}대 설비
          </div>
        </div>

        {/* 품질 합격률 */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition card-3d">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">
              {stats.metrics.quality_metrics.pass_rate_percent.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">품질 합격률</h3>
          <div className="text-sm text-gray-500">
            불량: {formatNumber(stats.metrics.quality_metrics.total_defects)}개
          </div>
        </div>

        {/* 평균 ROI */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition card-3d">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">
              {stats.metrics.roi_metrics.average_roi_percent.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">평균 ROI</h3>
          <div className="text-sm text-gray-500">
            {stats.total_simulations}건 시뮬레이션
          </div>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 설비 성능 */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">설비 성능 분석</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">총 가동 시간</span>
              <span className="font-semibold">
                {formatNumber(stats.metrics.equipment_performance.total_uptime_hours)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">총 정지 시간</span>
              <span className="font-semibold text-red-400">
                {formatNumber(stats.metrics.equipment_performance.total_downtime_hours)}h
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-primary h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.metrics.equipment_performance.availability_percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI 분석 */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">ROI 분석</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">총 투자액</span>
              <span className="font-semibold">
                {formatCurrency(stats.metrics.roi_metrics.total_investment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">연간 절감액</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(stats.metrics.roi_metrics.total_saving)}
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {stats.metrics.roi_metrics.average_roi_percent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">평균 투자 수익률</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 새로고침 버튼 */}
      <div className="text-center">
        <button
          onClick={fetchDashboardData}
          className="px-8 py-3 bg-primary text-main rounded-lg hover:bg-primary/90 transition magnetic-hover"
        >
          데이터 새로고침
        </button>
      </div>
    </div>
  );
};

export default MockDataDashboard;
