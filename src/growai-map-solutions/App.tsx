import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ImplementationSteps from './components/ImplementationSteps';
import MetricsGrid from './components/MetricsGrid';
import DiagnosisDashboard from './components/DiagnosisDashboard';
import ExpertMatcher from './components/ExpertMatcher';
import ROISimulator from './components/ROISimulator';
import Testimonial from './components/Testimonial';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import MockDataDashboard from './components/MockDataDashboard';
import TimeSeriesChart from './components/TimeSeriesChart';
import TechnicalChatbot from './components/TechnicalChatbot';
import ReferenceFactory from './components/ReferenceFactory';
import LMSContainer from './components/LMSContainer';
import ChatBot from './components/ChatBot';

// 권한별 페이지
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ConsultantTablet from './pages/ConsultantTablet';
import LMSLayout from './pages/LMSLayout';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // 로그인하지 않은 경우 - 공개 랜딩 페이지
  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <div className="min-h-screen selection:bg-primary/30">
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
            <TrustBar />
            
            <div className="py-24 space-y-32">
              {/* Platform - Diagnosis & Real-time Monitoring */}
              <div id="platform" className="space-y-16 scroll-mt-20">
                <MockDataDashboard />
                <TimeSeriesChart />
                <DiagnosisDashboard />
              </div>
              
              {/* Solutions - ROI Simulation */}
              <div id="solutions" className="scroll-mt-20">
                <ROISimulator />
              </div>

              {/* Expert Matching - Intelligent Matching & Expert Tools */}
              <div id="expert-matcher" className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start scroll-mt-20">
                <div className="lg:col-span-2">
                  <ExpertMatcher />
                </div>
                <div className="lg:col-span-1">
                  <TechnicalChatbot />
                </div>
              </div>

              {/* Testimonials - Social Proof & Training */}
              <div id="testimonials" className="space-y-24 scroll-mt-20">
                <ReferenceFactory />
                <Testimonial />
              </div>

              {/* LMS - Learning Management System */}
              <div id="lms" className="scroll-mt-20">
                <LMSContainer />
              </div>
              
              <MetricsGrid />
              <ImplementationSteps />
              
              {/* Contact - CTA Section */}
              <div id="contact" className="scroll-mt-20">
                <CTASection />
              </div>
            </div>
          </main>

          <Footer />
          
          {/* 플로팅 챗봇 */}
          <ChatBot />

          {/* 로그인 유도 배너 */}
          <div className="fixed bottom-6 left-6 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl shadow-2xl max-w-sm z-40">
            <p className="font-bold mb-2">더 많은 기능을 이용하세요!</p>
            <p className="text-sm mb-3 opacity-90">로그인하여 권한별 전용 기능을 사용하세요</p>
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '#login';
              }}
              className="block w-full bg-white text-primary py-2 rounded-lg text-center font-medium hover:opacity-90 transition"
            >
              로그인하기
            </a>
          </div>
        </div>
      </LanguageProvider>
    );
  }

  // 로그인한 경우 - 권한별 페이지
  return (
    <LanguageProvider>
      <div className="min-h-screen selection:bg-primary/30">
        {/* 권한별 라우팅 */}
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'consultant' && <ConsultantTablet />}
        {user?.role === 'student' && <LMSLayout />}
        
        {/* 로그아웃 버튼 (모든 권한) */}
        <button
          onClick={logout}
          className="fixed top-4 right-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition z-50"
        >
          로그아웃
        </button>
      </div>
    </LanguageProvider>
  );
};

const App: React.FC = () => {
  // URL 해시로 로그인 페이지 표시
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    const handleHashChange = () => {
      setShowLogin(window.location.hash === '#login');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (showLogin) {
    return (
      <AuthProvider>
        <LanguageProvider>
          <LoginPage />
        </LanguageProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
