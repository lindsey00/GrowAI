import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import './App.css'

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // API 헬스체크 (백그라운드)
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        console.log('Backend API Status:', data);
      })
      .catch(err => {
        console.error('Health check failed:', err);
      });
  }, []);

  if (showLanding) {
    return <LandingPage />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>GrowAI-MAP</h1>
        <p>제조 AX 전환을 위한 지능형 분석 및 예측 플랫폼</p>

        {health ? (
          <div className="health-status">
            <h2>시스템 상태: {health.status}</h2>
            <p>서비스: {health.service}</p>
            <p>버전: {health.version}</p>
          </div>
        ) : (
          <p>백엔드 서버에 연결할 수 없습니다.</p>
        )}

        <button onClick={() => setShowLanding(true)}>
          랜딩 페이지 보기
        </button>
      </header>
    </div>
  )
}

export default App
