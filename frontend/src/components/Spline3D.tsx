import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import './Spline3D.css';

interface Spline3DProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Spline 3D 애니메이션 컴포넌트
 * 제조 AI 플랫폼을 위한 고퀄리티 3D 비주얼
 */
const Spline3D: React.FC<Spline3DProps> = ({ scene, className = '', fallback }) => {
  const defaultFallback = (
    <div className="spline-loading">
      <div className="loading-spinner"></div>
      <p>3D 로딩 중...</p>
    </div>
  );

  return (
    <div className={`spline-container ${className}`}>
      <Suspense fallback={fallback || defaultFallback}>
        <Spline
          scene={scene}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
};

export default Spline3D;

/**
 * 제조 AI 플랫폼을 위한 프리셋 3D 씬들
 * Spline Community의 무료 리소스 활용
 */

// Hero Section용 - 로봇 팔 / 산업용 기계
export const HeroSpline3D: React.FC = () => (
  <Spline3D
    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
    className="hero-spline"
  />
);

// Stats Section용 - 데이터 시각화 3D
export const DataSpline3D: React.FC = () => (
  <Spline3D
    scene="https://prod.spline.design/RjZkAOCnO2EAqgDi/scene.splinecode"
    className="data-spline"
  />
);

// ROI Section용 - 추상적 3D 그래프
export const GraphSpline3D: React.FC = () => (
  <Spline3D
    scene="https://prod.spline.design/2xZxjJGgdKIF2gVD/scene.splinecode"
    className="graph-spline"
  />
);

// Agony Section용 - 기어/톱니바퀴 메커니즘
export const MechanismSpline3D: React.FC = () => (
  <Spline3D
    scene="https://prod.spline.design/GQ9tq3l4PJKmvMDr/scene.splinecode"
    className="mechanism-spline"
  />
);

// CTA Section용 - 추상적 플로팅 오브젝트
export const FloatingSpline3D: React.FC = () => (
  <Spline3D
    scene="https://prod.spline.design/WQvNJBrjcKd9FQeD/scene.splinecode"
    className="floating-spline"
  />
);
