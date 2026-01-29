import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechnologySection from './components/TechnologySection';
import PlatformSection from './components/PlatformSection';
import ExpertMatcher from './components/ExpertMatcher';
import TechnicalChatbot from './components/TechnicalChatbot';
import ReferenceFactory from './components/ReferenceFactory';
import Footer from './components/Footer';

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
        <div className="min-h-screen bg-black selection:bg-blue-500/30">
          <Navbar />
          
          <main>
            {/* Hero Section */}
            <Hero />
            
            {/* Technology Section */}
            <TechnologySection />
            
            {/* Platform Section with 3D */}
            <PlatformSection>
              <div className="max-w-5xl mx-auto">
                <ExpertMatcher />
              </div>
            </PlatformSection>

            {/* Success Stories Section */}
            <section id="solutions" className="relative py-32 bg-black">
              <div className="max-w-7xl mx-auto px-6">
                <ReferenceFactory />
              </div>
            </section>

            {/* Footer */}
            <Footer />
          </main>

          {/* Floating Technical Chatbot */}
          <TechnicalChatbot />
        </div>
      </LanguageProvider>
    );
  }

  // 로그인한 경우 - 권한별 페이지
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black">
        {/* 권한별 라우팅 */}
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'consultant' && <ConsultantTablet />}
        {user?.role === 'student' && <LMSLayout />}
        
        {/* 로그아웃 버튼 (모든 권한) */}
        <button
          onClick={logout}
          className="fixed top-4 right-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition z-50"
        >
          Logout
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
