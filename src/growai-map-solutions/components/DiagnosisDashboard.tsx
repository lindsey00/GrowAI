import React, { useState, useRef } from 'react';
import { Activity, AlertCircle, TrendingUp, FileText, Sparkles, CheckCircle, Download, Upload, FileCheck } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const DiagnosisDashboard = () => {
  const [scores, setScores] = useState({
    quality: 5,
    facility: 5,
    process: 5,
    safety: 5,
    hr: 5
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logAnalysis, setLogAnalysis] = useState<any>(null);
  const [analyzingLog, setAnalyzingLog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const concernLabels: { [key: string]: { ko: string; icon: any } } = {
    quality: { ko: '품질 (Quality)', icon: Activity },
    facility: { ko: '설비 (Facility)', icon: AlertCircle },
    process: { ko: '공정 (Process)', icon: TrendingUp },
    safety: { ko: '안전 (Safety)', icon: AlertCircle },
    hr: { ko: '인력 (HR)', icon: Activity }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScores({ ...scores, [e.target.name]: parseInt(e.target.value) });
  };

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/diagnose/questionnaire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      });
      const data = await response.json();
      
      // Precision diagnosis call simulation
      const precisionResponse = await fetch(`${API_BASE_URL}/diagnose/precision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: JSON.stringify(data) }),
      });
      const precisionData = await precisionResponse.json();
      
      setResult({
        ...data,
        detailed_diagnosis: precisionData.detailed_diagnosis
      });
    } catch (error) {
      console.error('Diagnosis failed:', error);
      alert('백엔드 서버가 실행 중인지 확인해주세요 (http://localhost:8000)');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingLog(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/diagnose/log`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setLogAnalysis(data);
    } catch (error) {
      console.error('Log analysis failed:', error);
      alert('로그 분석 중 오류가 발생했습니다.');
    } finally {
      setAnalyzingLog(false);
    }
  };

  const downloadReport = () => {
    if (!result?.report_id) return;
    window.open(`${API_BASE_URL}/report/generate/${result.report_id}`, '_blank');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <section id="diagnosis" className="py-12 animate-fade-in-up">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Diagnosis Engine v2.0</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">
          제조 5대 고민 진단 및 데이터 분석
        </h2>
        <p className="text-gray-400">
          Vertex AI 기반 정밀 진단과 설비 로그 데이터 분석을 통해 공정의 숨은 인사이트를 도출합니다.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 진단 입력 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">자가 진단 (1-10점)</h3>
            </div>
            
            {Object.keys(scores).map((key) => {
              const Icon = concernLabels[key].icon;
              const score = scores[key as keyof typeof scores];
              
              return (
                <div key={key} className="space-y-3 p-4 bg-main rounded-xl border border-border hover:border-primary/50 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
                      <span className="font-medium">{concernLabels[key].ko}</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      name={key}
                      min="1"
                      max="10"
                      value={score}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              );
            })}
            
            <button
              onClick={runDiagnosis}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all magnetic-hover disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Vertex AI 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI 정밀 진단 보고서 생성</span>
                </>
              )}
            </button>
          </div>

          {/* 오른쪽: 진단 결과 */}
          <div className="bg-main border border-border rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-primary" />
              AI 진단 결과
            </h3>
            
            {result ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    result.urgency_level === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    AX 긴급도: {result.urgency_level}
                  </span>
                  <button 
                    onClick={downloadReport}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Download className="w-4 h-4" /> PDF 다운로드
                  </button>
                </div>
                
                <div className="bg-surface border border-border rounded-lg p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <div className="mb-6">
                    <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Vertex AI Insight
                    </h4>
                    <p className="text-gray-300 text-sm italic leading-relaxed">
                      "{result.detailed_diagnosis}"
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold border-b border-border pb-1">핵심 제언</h4>
                    <p className="text-sm text-gray-300">
                      <strong>우선순위:</strong> {result.primary_concern.toUpperCase()}<br/>
                      <strong>추천 솔루션:</strong> {result.recommendation}
                    </p>
                    <div className="bg-primary/5 p-3 rounded border border-primary/20">
                      <p className="text-xs text-primary font-semibold">예상 연간 절감 잠재력</p>
                      <p className="text-xl font-bold text-primary">{result.estimated_savings}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">
                      {result.similar_cases_count}개의 유사 업종 레퍼런스 데이터 기반 분석 완료
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
                <div className="relative mb-6">
                  <FileText className="w-16 h-16 opacity-20" />
                  <Sparkles className="w-8 h-8 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
                <p className="text-center italic max-w-xs">
                  자가 진단 항목을 조정한 후,<br />
                  상단의 버튼을 클릭하여 정밀 진단을 시작하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단: 로그 데이터 분석 섹션 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 bg-secondary/5 border border-secondary/20 rounded-xl">
            <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              로그 데이터 분석
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              CSV/JSON 생산 로그를 업로드하여 이상 징후 및 상관관계를 실시간으로 분석합니다.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".csv,.json"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzingLog}
              className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all font-medium"
            >
              {analyzingLog ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-4 h-4" />
              )}
              파일 업로드 및 분석
            </button>
          </div>

          <div className="lg:col-span-2 bg-main border border-border rounded-xl p-6 min-h-[200px]">
            {logAnalysis ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-200">{logAnalysis.filename} 분석 결과</h4>
                    <p className="text-xs text-gray-500">총 {logAnalysis.rows}행 데이터 분석 완료</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${logAnalysis.anomalies_found > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    이상 징후: {logAnalysis.anomalies_found}건
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface rounded border border-border">
                    <p className="text-xs text-gray-500 mb-1">AI 정밀 판독 (Insight)</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {logAnalysis.ai_insight}
                    </p>
                  </div>
                  <div className="p-3 bg-surface rounded border border-border">
                    <p className="text-xs text-gray-500 mb-1">상관관계 분석</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(logAnalysis.statistics).slice(0, 4).map(key => (
                        <span key={key} className="text-[10px] bg-border px-1.5 py-0.5 rounded text-gray-400">
                          {key}: OK
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <Activity className="w-10 h-10 mb-2 opacity-10" />
                <p className="text-sm italic">로그 파일을 업로드하면 데이터 분석 결과가 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisDashboard;