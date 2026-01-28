import React, { useEffect, useState } from 'react';
import { HeroSpline3D, DataSpline3D, FloatingSpline3D } from '../components/Spline3D';
import './LandingPage.css';

interface AgonyCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  solution: string;
  color: string;
}

const LandingPageWith3D: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [enable3D, setEnable3D] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // 저사양 디바이스 감지
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setEnable3D(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const agonies: AgonyCard[] = [
    {
      id: 'quality',
      title: '품질 블라인드',
      subtitle: 'Quality Blind',
      icon: '👁️',
      solution: 'Vision AI',
      color: '#4A90E2'
    },
    {
      id: 'equipment',
      title: '돌발 셧다운',
      subtitle: 'Sudden Shutdown',
      icon: '⚡',
      solution: 'Predictive Maintenance',
      color: '#E94B3C'
    },
    {
      id: 'process',
      title: '깜깜이 공정',
      subtitle: 'Pitch-Black Process',
      icon: '🔍',
      solution: 'APS 공정 최적화',
      color: '#F5A623'
    },
    {
      id: 'safety',
      title: '위험 사각지대',
      subtitle: 'Danger Zone',
      icon: '⚠️',
      solution: 'Safety AI',
      color: '#7ED321'
    },
    {
      id: 'labor',
      title: '인력난/반복노동',
      subtitle: 'Labor Shortage',
      icon: '🤖',
      solution: 'Robot Automation',
      color: '#BD10E0'
    }
  ];

  const stats = [
    { value: '150+', label: '파트너사', unit: 'Partners' },
    { value: '95%', label: '고객 만족도', unit: 'Satisfaction' },
    { value: '30%', label: '평균 비용 절감', unit: 'Cost Reduction' },
    { value: '24/7', label: '실시간 모니터링', unit: 'Monitoring' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section with 3D */}
      <section className={`hero ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-background">
          <div className="animated-grid"></div>
          {enable3D && (
            <div className="hero-3d-wrapper">
              <HeroSpline3D />
            </div>
          )}
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>제조 AX 전환의 새로운 기준</span>
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">GrowAI-MAP</span>
          </h1>
          <p className="hero-subtitle">
            Manufacturing Analysis & Prediction Platform
          </p>
          <p className="hero-description">
            데이터로 진단하고, AI로 예측하며, ROI로 증명하는<br />
            제조 스마트팩토리의 완벽한 시작
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary">
              무료 진단 시작
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-secondary">
              <span className="play-icon">▶</span>
              소개 영상 보기
            </button>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <p>Scroll to explore</p>
          </div>
        </div>
      </section>

      {/* Stats Section with 3D Data Viz */}
      <section className="stats-section">
        <div className="container">
          {enable3D && (
            <div className="stats-3d-bg">
              <DataSpline3D />
            </div>
          )}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-unit">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agony Section */}
      <section className="agony-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">제조 5대 고민</span>
            <h2 className="section-title">
              당신의 고민을<br />
              <span className="gradient-text">AI로 해결합니다</span>
            </h2>
            <p className="section-description">
              15년간 축적된 제조 현장 데이터와 AI 기술의 결합으로<br />
              실질적인 문제 해결을 제공합니다
            </p>
          </div>

          <div className="agony-grid">
            {agonies.map((agony, index) => (
              <div
                key={agony.id}
                className="agony-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  borderColor: agony.color
                }}
              >
                <div className="agony-icon" style={{ color: agony.color }}>
                  {agony.icon}
                </div>
                <h3 className="agony-title">{agony.title}</h3>
                <p className="agony-subtitle">{agony.subtitle}</p>
                <div className="agony-divider" style={{ background: agony.color }}></div>
                <div className="agony-solution">
                  <span className="solution-label">Solution</span>
                  <span className="solution-value">{agony.solution}</span>
                </div>
                <button className="agony-btn" style={{ borderColor: agony.color }}>
                  상세보기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="roi-section">
        <div className="container">
          <div className="roi-content">
            <div className="roi-left">
              <span className="section-badge">ROI 시뮬레이션</span>
              <h2 className="section-title">
                투자 대비 효과를<br />
                <span className="gradient-text">한눈에 확인하세요</span>
              </h2>
              <div className="roi-features">
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <div className="feature-content">
                    <h4>경제성 분석</h4>
                    <p>Standard vs Custom ROI 비교</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌱</div>
                  <div className="feature-content">
                    <h4>ESG 성과 측정</h4>
                    <p>탄소 배출 감소 및 에너지 효율</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-content">
                    <h4>실시간 시뮬레이션</h4>
                    <p>변수 조절로 즉시 결과 확인</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-large">
                ROI 계산하기
                <span className="btn-arrow">→</span>
              </button>
            </div>
            <div className="roi-right">
              <div className="roi-chart">
                <div className="chart-header">
                  <h3>예상 투자 수익</h3>
                  <span className="chart-period">12개월 기준</span>
                </div>
                <div className="chart-bars">
                  <div className="bar-group">
                    <div className="bar bar-investment" style={{ height: '60%' }}>
                      <span className="bar-label">투자액</span>
                      <span className="bar-value">7천만원</span>
                    </div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bar-savings" style={{ height: '100%' }}>
                      <span className="bar-label">예상 절감</span>
                      <span className="bar-value">1.2억원</span>
                    </div>
                  </div>
                </div>
                <div className="chart-roi">
                  <span className="roi-label">ROI</span>
                  <span className="roi-value">+71%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Floating 3D */}
      <section className="cta-section">
        {enable3D && <FloatingSpline3D />}
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              지금 바로 시작하세요
            </h2>
            <p className="cta-description">
              무료 자가진단으로 우리 기업의 제조 혁신 가능성을 확인해보세요
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">
                무료 진단 시작하기
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn btn-secondary btn-large">
                전문가 상담 신청
              </button>
            </div>
            <div className="cta-trust">
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>카드 등록 불필요</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>5분 안에 결과 확인</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>즉시 리포트 제공</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Toggle Button */}
      <button
        className="toggle-3d-btn"
        onClick={() => setEnable3D(!enable3D)}
        title={enable3D ? '3D 비활성화' : '3D 활성화'}
      >
        {enable3D ? '🎨' : '🖼️'}
      </button>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">GrowAI-MAP</div>
              <p className="footer-tagline">
                제조 스마트팩토리의 완벽한 시작
              </p>
            </div>
            <div className="footer-right">
              <div className="footer-links">
                <a href="/about">회사소개</a>
                <a href="/services">서비스</a>
                <a href="/partners">파트너</a>
                <a href="/contact">문의하기</a>
              </div>
              <div className="footer-info">
                <p>© 2024 Newcle Inc. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageWith3D;
