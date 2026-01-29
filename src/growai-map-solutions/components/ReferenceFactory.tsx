import React, { useState } from 'react';
import { Search, Filter, Building2, TrendingUp, Award, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface ReferenceCase {
  id: string;
  company: string;
  industry: string;
  solution: string;
  challenge: string;
  results: {
    metric: string;
    improvement: string;
  }[];
  roi: string;
  timeline: string;
  location: string;
  partner: string;
  year: number;
  tags: string[];
  description: string;
}

const ReferenceFactory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<ReferenceCase | null>(null);

  // 성공 사례 데이터베이스
  const referenceCases: ReferenceCase[] = [
    {
      id: '1',
      company: 'Hyundai Motor Company',
      industry: 'Automotive',
      solution: 'Predictive Maintenance System',
      challenge: 'Frequent unexpected equipment failures causing production delays',
      results: [
        { metric: 'Downtime Reduction', improvement: '40%' },
        { metric: 'Maintenance Cost Savings', improvement: '₩450M/year' },
        { metric: 'Production Efficiency', improvement: '+15%' }
      ],
      roi: '6 months',
      timeline: '3 months implementation',
      location: 'Ulsan, Korea',
      partner: 'Global AX Solutions',
      year: 2023,
      tags: ['Predictive Maintenance', 'IoT', 'Machine Learning'],
      description: 'Implemented AI-powered predictive maintenance system across 5 production lines, reducing unplanned downtime by 40% and saving ₩450M annually.'
    },
    {
      id: '2',
      company: 'Samsung Electronics',
      industry: 'Electronics',
      solution: 'AI Vision Inspection System',
      challenge: 'High defect rate in semiconductor manufacturing',
      results: [
        { metric: 'Defect Detection Rate', improvement: '99.8%' },
        { metric: 'Quality Cost Reduction', improvement: '₩320M/year' },
        { metric: 'Inspection Speed', improvement: '+200%' }
      ],
      roi: '8 months',
      timeline: '4 months implementation',
      location: 'Suwon, Korea',
      partner: 'Smart Factory Co.',
      year: 2023,
      tags: ['Vision Inspection', 'Quality Control', 'Deep Learning'],
      description: 'Deployed AI vision inspection system achieving 99.8% defect detection accuracy while tripling inspection speed.'
    },
    {
      id: '3',
      company: 'POSCO',
      industry: 'Steel Manufacturing',
      solution: 'ESG Optimization Platform',
      challenge: 'High energy consumption and carbon emissions',
      results: [
        { metric: 'Energy Reduction', improvement: '30%' },
        { metric: 'Carbon Emissions', improvement: '-25%' },
        { metric: 'Cost Savings', improvement: '₩280M/year' }
      ],
      roi: '10 months',
      timeline: '5 months implementation',
      location: 'Pohang, Korea',
      partner: 'Green Energy AI',
      year: 2024,
      tags: ['ESG', 'Energy Management', 'Sustainability'],
      description: 'Implemented ESG optimization platform reducing energy consumption by 30% and carbon emissions by 25%.'
    },
    {
      id: '4',
      company: 'LG Display',
      industry: 'Display Manufacturing',
      solution: 'Process Automation System',
      challenge: 'Manual processes causing bottlenecks and errors',
      results: [
        { metric: 'Productivity Increase', improvement: '+40%' },
        { metric: 'Error Rate Reduction', improvement: '-60%' },
        { metric: 'Labor Cost Savings', improvement: '₩380M/year' }
      ],
      roi: '7 months',
      timeline: '3 months implementation',
      location: 'Paju, Korea',
      partner: 'AutoMate Systems',
      year: 2023,
      tags: ['Process Automation', 'RPA', 'Efficiency'],
      description: 'Automated 15 manual processes, increasing productivity by 40% and reducing errors by 60%.'
    },
    {
      id: '5',
      company: 'SK Hynix',
      industry: 'Semiconductor',
      solution: 'Quality Control AI System',
      challenge: 'Inconsistent quality across production batches',
      results: [
        { metric: 'Quality Consistency', improvement: '+95%' },
        { metric: 'Scrap Rate Reduction', improvement: '-35%' },
        { metric: 'Revenue Impact', improvement: '₩520M/year' }
      ],
      roi: '5 months',
      timeline: '4 months implementation',
      location: 'Icheon, Korea',
      partner: 'Precision Tech Inc.',
      year: 2024,
      tags: ['Quality Control', 'AI', 'Semiconductor'],
      description: 'Deployed AI-powered quality control system achieving 95% consistency and reducing scrap rate by 35%.'
    }
  ];

  const industries = ['all', ...Array.from(new Set(referenceCases.map(c => c.industry)))];

  const filteredCases = referenceCases.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // 로그 기록
  const handleSearch = () => {
    logTest('Reference Search', {
      query: searchQuery,
      industry: selectedIndustry,
      resultsFound: filteredCases.length
    });
  };

  return (
    <section id="references" className="py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Success Stories</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">Reference Factory</h2>
        <p className="text-gray-400">Proven results from leading manufacturers</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by company, solution, or tags..."
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition"
          />
        </div>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition"
        >
          {industries.map(industry => (
            <option key={industry} value={industry}>
              {industry === 'all' ? 'All Industries' : industry}
            </option>
          ))}
        </select>
        <button 
          onClick={handleSearch}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-400 mb-6">
        Found {filteredCases.length} success {filteredCases.length === 1 ? 'case' : 'cases'}
      </p>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            onClick={() => setSelectedCase(caseItem)}
            className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition cursor-pointer hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{caseItem.company}</h3>
                <p className="text-sm text-gray-400">{caseItem.industry}</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                {caseItem.year}
              </span>
            </div>

            <p className="text-sm font-medium text-primary mb-3">{caseItem.solution}</p>

            <div className="space-y-2 mb-4">
              {caseItem.results.slice(0, 2).map((result, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-400">{result.metric}</span>
                  <span className="font-bold text-green-400">{result.improvement}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                ROI: {caseItem.roi}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {caseItem.location.split(',')[0]}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {caseItem.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedCase.company}</h2>
                <p className="text-gray-400">{selectedCase.industry}</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg font-bold">
                {selectedCase.year}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xl text-primary mb-2">{selectedCase.solution}</h3>
              <p className="text-gray-300">{selectedCase.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-main rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Partner</p>
                <p className="font-bold">{selectedCase.partner}</p>
              </div>
              <div className="p-4 bg-main rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="font-bold">{selectedCase.location}</p>
              </div>
              <div className="p-4 bg-main rounded-lg">
                <p className="text-sm text-gray-400 mb-1">ROI Timeline</p>
                <p className="font-bold">{selectedCase.roi}</p>
              </div>
              <div className="p-4 bg-main rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Implementation</p>
                <p className="font-bold">{selectedCase.timeline}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3">Challenge</h4>
              <p className="text-gray-300 bg-main p-4 rounded-lg">{selectedCase.challenge}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3">Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCase.results.map((result, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">{result.metric}</p>
                    <p className="text-2xl font-bold text-primary">{result.improvement}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCase(null)}
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
  
  const existingLog = localStorage.getItem('test_log') || '';
  localStorage.setItem('test_log', existingLog + logEntry);
  
  console.log(`✅ Test logged: ${testName}`, data);
}

export default ReferenceFactory;
