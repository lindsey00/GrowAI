import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, TrendingUp, Award, MapPin, Wrench, Headphones, DollarSign } from 'lucide-react';

interface ExpertScores {
  reference: number;
  price: number;
  location: number;
  maturity: number;
  maintenance: number;
  service: number;
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  industry: string;
  scores: ExpertScores;
  projects: number;
  location: string;
  certifications: string[];
  description: string;
}

const ExpertMatcher: React.FC = () => {
  const { t } = useLanguage();
  
  const [weights, setWeights] = useState<ExpertScores>({
    reference: 80,
    price: 50,
    location: 40,
    maturity: 70,
    maintenance: 60,
    service: 90,
  });

  // 전문가 데이터베이스 (실제로는 백엔드 API에서 가져옴)
  const expertDatabase: Expert[] = [
    {
      id: '1',
      name: 'Global AX Solutions',
      specialty: 'Predictive Maintenance',
      industry: 'Automotive',
      scores: { reference: 95, price: 60, location: 50, maturity: 80, maintenance: 70, service: 98 },
      projects: 127,
      location: 'Seoul, Korea',
      certifications: ['ISO 9001', 'Industry 4.0'],
      description: '자동차 산업 특화 예측 유지보수 전문 기업'
    },
    {
      id: '2',
      name: 'Smart Factory Co.',
      specialty: 'Vision Inspection',
      industry: 'Electronics',
      scores: { reference: 70, price: 90, location: 60, maturity: 95, maintenance: 75, service: 80 },
      projects: 89,
      location: 'Busan, Korea',
      certifications: ['ISO 13485', 'CE Mark'],
      description: '전자 제품 비전 검사 시스템 전문'
    },
    {
      id: '3',
      name: 'Green Energy AI',
      specialty: 'ESG Optimization',
      industry: 'Energy',
      scores: { reference: 80, price: 70, location: 85, maturity: 75, maintenance: 80, service: 92 },
      projects: 65,
      location: 'Incheon, Korea',
      certifications: ['ISO 14001', 'LEED'],
      description: 'ESG 최적화 및 에너지 관리 솔루션'
    },
    {
      id: '4',
      name: 'Precision Tech Inc.',
      specialty: 'Quality Control',
      industry: 'Semiconductor',
      scores: { reference: 85, price: 80, location: 70, maturity: 90, maintenance: 85, service: 88 },
      projects: 112,
      location: 'Suwon, Korea',
      certifications: ['ISO 9001', 'IATF 16949'],
      description: '반도체 품질 관리 AI 시스템'
    },
    {
      id: '5',
      name: 'AutoMate Systems',
      specialty: 'Process Automation',
      industry: 'Manufacturing',
      scores: { reference: 90, price: 55, location: 75, maturity: 85, maintenance: 90, service: 95 },
      projects: 156,
      location: 'Seoul, Korea',
      certifications: ['ISO 9001', 'Six Sigma'],
      description: '제조 공정 자동화 통합 솔루션'
    },
    {
      id: '6',
      name: 'DataDrive Analytics',
      specialty: 'Supply Chain Optimization',
      industry: 'Logistics',
      scores: { reference: 75, price: 85, location: 65, maturity: 80, maintenance: 70, service: 85 },
      projects: 73,
      location: 'Daegu, Korea',
      certifications: ['ISO 28000', 'C-TPAT'],
      description: '공급망 최적화 데이터 분석'
    }
  ];

  // 가중치 기반 점수 계산
  const calculateScore = (expertScores: ExpertScores): number => {
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return 0;

    const weightedScore = 
      (expertScores.reference * weights.reference +
       expertScores.price * weights.price +
       expertScores.location * weights.location +
       expertScores.maturity * weights.maturity +
       expertScores.maintenance * weights.maintenance +
       expertScores.service * weights.service) / totalWeight;

    return Math.round(weightedScore);
  };

  // 강점 분석 (가장 높은 2개 기준)
  const getStrengths = (expertScores: ExpertScores): string[] => {
    const criteriaNames: { [key: string]: string } = {
      reference: 'Reference',
      price: 'Price',
      location: 'Location',
      maturity: 'Maturity',
      maintenance: 'Maintenance',
      service: 'Service'
    };

    return Object.entries(expertScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 2)
      .map(([key]) => criteriaNames[key]);
  };

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const handleMatch = async () => {
    setLoading(true);
    
    // 시뮬레이션: 1초 후 재계산
    setTimeout(() => {
      const calculatedMatches = expertDatabase.map(expert => ({
        ...expert,
        score: calculateScore(expert.scores),
        strengths: getStrengths(expert.scores)
      })).sort((a, b) => b.score - a.score).slice(0, 5);

      setMatches(calculatedMatches);
      setLoading(false);

      // 로그 기록
      logTest('Expert Matching', {
        weights,
        totalExperts: expertDatabase.length,
        matchedExperts: calculatedMatches.length,
        topMatch: calculatedMatches[0]?.name,
        topScore: calculatedMatches[0]?.score
      });
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const criteriaIcons: { [key: string]: any } = {
    reference: Award,
    price: DollarSign,
    location: MapPin,
    maturity: TrendingUp,
    maintenance: Wrench,
    service: Headphones
  };

  return (
    <section id="expert-matcher" className="py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          {/* Weight Controls */}
          <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Expert Matcher</h3>
            <p className="text-sm text-gray-600 mb-8">Adjust weights to find the best partner for your specific needs.</p>
            
            <div className="space-y-6">
              {Object.entries(weights).map(([key, value]) => {
                const Icon = criteriaIcons[key];
                return (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{key}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleMatch}
              disabled={loading}
              className="w-full mt-10 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Find Best Matches</span>
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          <div className="md:w-2/3 p-8">
            {matches.length > 0 ? (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-gray-800">Top Recommendations</h4>
                {matches.map((match, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedExpert(match)}
                    className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 transition-all shadow-sm cursor-pointer hover:shadow-md"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className={`font-bold text-xl ${getScoreColor(match.score)}`}>
                        {match.score}
                      </span>
                    </div>
                    <div className="ml-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-gray-900 text-lg">{match.name}</h5>
                          <p className="text-sm text-gray-500">{match.specialty}</p>
                        </div>
                        {idx === 0 && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Best Match</span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        {match.strengths.map((s: string) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium uppercase tracking-tighter">{s}</span>
                        ))}
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md font-medium">{match.projects} projects</span>
                      </div>
                    </div>
                    <button className="ml-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium italic">Adjust weights and click "Find Best Matches" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expert Detail Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedExpert(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4">{selectedExpert.name}</h3>
            <p className="text-gray-600 mb-6">{selectedExpert.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Specialty</p>
                <p className="font-bold">{selectedExpert.specialty}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Industry</p>
                <p className="font-bold">{selectedExpert.industry}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-bold">{selectedExpert.location}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Projects</p>
                <p className="font-bold">{selectedExpert.projects}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {selectedExpert.certifications.map((cert, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setSelectedExpert(null)}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

// 테스트 로그 기록 함수
function logTest(testName: string, data: any) {
  const timestamp = new Date().toISOString();
  const logEntry = `\n[${timestamp}] ${testName}\n${JSON.stringify(data, null, 2)}\n`;
  
  // 로컬 스토리지에 임시 저장 (실제로는 파일에 기록)
  const existingLog = localStorage.getItem('test_log') || '';
  localStorage.setItem('test_log', existingLog + logEntry);
  
  console.log(`✅ Test logged: ${testName}`, data);
}

export default ExpertMatcher;