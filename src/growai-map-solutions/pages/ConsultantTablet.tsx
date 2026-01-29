import React, { useState } from 'react';
import { 
  Tablet,
  ClipboardCheck,
  BarChart3,
  FileText,
  Camera,
  Mic,
  Save,
  Send,
  ChevronRight
} from 'lucide-react';
import DiagnosisDashboard from '../components/DiagnosisDashboard';

const ConsultantTablet: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'diagnosis' | 'simulation' | 'report'>('diagnosis');
  const [clientInfo, setClientInfo] = useState({
    company: '',
    industry: '',
    contact: ''
  });

  return (
    <div className="min-h-screen bg-main">
      {/* 태블릿 최적화 헤더 */}
      <div className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Tablet className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">현장 컨설팅 도구</h1>
                <p className="text-xs text-gray-400">터치 최적화 인터페이스</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <Save className="w-4 h-4 inline mr-1" />
              저장
            </button>
          </div>

          {/* 고객 정보 입력 (빠른 접근) */}
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="회사명"
              value={clientInfo.company}
              onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
              className="px-4 py-2 bg-main border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="산업"
              value={clientInfo.industry}
              onChange={(e) => setClientInfo({ ...clientInfo, industry: e.target.value })}
              className="px-4 py-2 bg-main border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="담당자"
              value={clientInfo.contact}
              onChange={(e) => setClientInfo({ ...clientInfo, contact: e.target.value })}
              className="px-4 py-2 bg-main border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* 탭 네비게이션 (터치 최적화) */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveSection('diagnosis')}
            className={`flex-1 py-4 text-sm font-medium transition ${
              activeSection === 'diagnosis'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-400'
            }`}
          >
            <ClipboardCheck className="w-5 h-5 mx-auto mb-1" />
            자가진단
          </button>
          <button
            onClick={() => setActiveSection('simulation')}
            className={`flex-1 py-4 text-sm font-medium transition ${
              activeSection === 'simulation'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-5 h-5 mx-auto mb-1" />
            시뮬레이션
          </button>
          <button
            onClick={() => setActiveSection('report')}
            className={`flex-1 py-4 text-sm font-medium transition ${
              activeSection === 'report'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-400'
            }`}
          >
            <FileText className="w-5 h-5 mx-auto mb-1" />
            보고서
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 자가진단 섹션 */}
        {activeSection === 'diagnosis' && (
          <div className="space-y-6">
            {/* 빠른 메모 */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">현장 메모</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-main rounded-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-main rounded-lg">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                placeholder="현장에서 발견한 사항을 기록하세요..."
                className="w-full h-24 px-4 py-3 bg-main border border-border rounded-lg resize-none focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {/* 진단 컴포넌트 */}
            <DiagnosisDashboard />
          </div>
        )}

        {/* 시뮬레이션 섹션 */}
        {activeSection === 'simulation' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">ROI 시뮬레이터</h3>
              
              {/* 시뮬레이션 입력 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">현재 월 생산량 (개)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">현재 불량률 (%)</label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">제품당 단가 (원)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold hover:opacity-90 transition">
                  ROI 계산하기
                </button>
              </div>

              {/* 시뮬레이션 결과 */}
              <div className="mt-6 p-6 bg-primary/10 border border-primary/30 rounded-xl">
                <h4 className="font-bold text-primary mb-4">예상 개선 효과</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">연간 절감액</p>
                    <p className="text-2xl font-bold text-green-400">₩450M</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">ROI 달성 기간</p>
                    <p className="text-2xl font-bold text-blue-400">6개월</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 보고서 섹션 */}
        {activeSection === 'report' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">현장 방문 보고서</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-main rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">방문 일시</p>
                  <p className="font-medium">{new Date().toLocaleString('ko-KR')}</p>
                </div>

                <div className="p-4 bg-main rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">고객 정보</p>
                  <p className="font-medium">{clientInfo.company || '미입력'}</p>
                  <p className="text-sm text-gray-400">{clientInfo.industry || '산업 미입력'}</p>
                </div>

                <div className="p-4 bg-main rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">진단 요약</p>
                  <p className="text-sm">5대 고민 진단 완료</p>
                  <p className="text-sm">ROI 시뮬레이션 완료</p>
                </div>

                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  보고서 전송 (본사)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 플로팅 액션 버튼 (태블릿 최적화) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center">
          <Camera className="w-6 h-6" />
        </button>
        <button className="w-14 h-14 bg-secondary text-white rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center">
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ConsultantTablet;
