import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      alert('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'consultant' | 'student') => {
    const credentials = {
      admin: { email: 'admin@growai.com', password: 'admin123' },
      consultant: { email: 'consultant@growai.com', password: 'consultant123' },
      student: { email: 'student@company.com', password: 'student123' }
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-main via-surface to-main flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">GrowAI-MAP</h1>
          </div>
          <p className="text-gray-400">Manufacturing Analysis & Prediction</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">로그인</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-main border border-border rounded-lg focus:outline-none focus:border-primary transition"
                placeholder="example@growai.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-main border border-border rounded-lg focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>로그인</span>
                </>
              )}
            </button>
          </form>

          {/* 빠른 로그인 (데모용) */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-gray-400 mb-3">빠른 로그인 (데모)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition"
              >
                관리자
              </button>
              <button
                onClick={() => quickLogin('consultant')}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition"
              >
                컨설턴트
              </button>
              <button
                onClick={() => quickLogin('student')}
                className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition"
              >
                학생
              </button>
            </div>
          </div>
        </div>

        {/* 권한 설명 */}
        <div className="mt-6 p-4 bg-surface/50 border border-border rounded-lg">
          <p className="text-xs text-gray-400 mb-2">권한별 기능:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• <span className="text-red-400">관리자</span>: 전체 대시보드, 파트너사 DB 관리</li>
            <li>• <span className="text-blue-400">컨설턴트</span>: 현장 진단, 시뮬레이션</li>
            <li>• <span className="text-green-400">학생</span>: LMS 학습 환경</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
