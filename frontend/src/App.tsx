import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import FileUploadPage from './pages/FileUploadPage'
import './App.css'

type PageType = 'landing' | 'upload' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => console.log('Backend API Status:', data))
      .catch(err => console.error('Health check failed:', err));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return <FileUploadPage />;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="App">
      <nav className="app-nav">
        <button
          className={`nav-btn ${currentPage === 'landing' ? 'active' : ''}`}
          onClick={() => setCurrentPage('landing')}
        >
          홈
        </button>
        <button
          className={`nav-btn ${currentPage === 'upload' ? 'active' : ''}`}
          onClick={() => setCurrentPage('upload')}
        >
          파일 업로드
        </button>
      </nav>
      {renderPage()}
    </div>
  )
}

export default App
