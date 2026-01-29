import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  TrendingUp, 
  FileText,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  industry: string;
  solutions: string[];
  status: 'active' | 'pending' | 'inactive';
  revenue: number;
  projects: number;
  rating: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // 샘플 파트너 데이터
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Global AX Solutions',
      industry: 'Automotive',
      solutions: ['Predictive Maintenance', 'Quality Control'],
      status: 'active',
      revenue: 450000000,
      projects: 12,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Smart Factory Co.',
      industry: 'Electronics',
      solutions: ['Vision Inspection', 'Process Optimization'],
      status: 'active',
      revenue: 320000000,
      projects: 8,
      rating: 4.6
    },
    {
      id: '3',
      name: 'Green Energy AI',
      industry: 'Energy',
      solutions: ['ESG Optimization', 'Energy Management'],
      status: 'pending',
      revenue: 280000000,
      projects: 5,
      rating: 4.5
    }
  ]);

  const stats = {
    totalPartners: partners.length,
    activeProjects: partners.reduce((sum, p) => sum + p.projects, 0),
    totalRevenue: partners.reduce((sum, p) => sum + p.revenue, 0),
    avgRating: partners.reduce((sum, p) => sum + p.rating, 0) / partners.length
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-main">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">관리자 대시보드</h1>
              <p className="text-sm text-gray-400">전체 시스템 관리 및 파트너사 DB</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                리포트 다운로드
              </button>
              <button className="p-2 hover:bg-main rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 inline mr-2" />
            개요
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'partners'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            파트너사 DB
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'analytics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            분석
          </button>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">총 파트너사</span>
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.totalPartners}</p>
                <p className="text-xs text-green-400 mt-1">+2 this month</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">진행 프로젝트</span>
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="text-xs text-green-400 mt-1">+5 this month</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">총 매출</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold">₩{(stats.totalRevenue / 100000000).toFixed(1)}억</p>
                <p className="text-xs text-green-400 mt-1">+18% YoY</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">평균 만족도</span>
                  <Users className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
                <p className="text-xs text-green-400 mt-1">+0.2 this quarter</p>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">최근 활동</h3>
              <div className="space-y-3">
                {[
                  { action: '신규 파트너사 등록', partner: 'Green Energy AI', time: '2시간 전' },
                  { action: '프로젝트 완료', partner: 'Global AX Solutions', time: '5시간 전' },
                  { action: '계약 갱신', partner: 'Smart Factory Co.', time: '1일 전' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-main rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.partner}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 파트너사 DB 탭 */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="파트너사 검색..."
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition"
                />
              </div>
              <button className="px-4 py-3 bg-surface border border-border rounded-lg hover:bg-main transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                필터
              </button>
              <button className="px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                신규 등록
              </button>
            </div>

            {/* 파트너사 테이블 */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-main border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">파트너사명</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">산업</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">솔루션</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">상태</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">프로젝트</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">평점</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} className="border-b border-border hover:bg-main transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          <p className="text-xs text-gray-400">ID: {partner.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{partner.industry}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {partner.solutions.slice(0, 2).map((sol, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                              {sol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          partner.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          partner.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{partner.projects}</td>
                      <td className="px-6 py-4 text-sm">⭐ {partner.rating}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-surface rounded transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-surface rounded transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-surface rounded transition text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 분석 탭 */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">산업별 분포</h3>
              <div className="space-y-3">
                {['Automotive', 'Electronics', 'Energy'].map((industry, idx) => {
                  const count = partners.filter(p => p.industry === industry).length;
                  const percentage = (count / partners.length) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{industry}</span>
                        <span className="text-sm font-bold">{count}개 ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-main rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
