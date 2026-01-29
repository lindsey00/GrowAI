import React, { useState } from 'react';
import { Star, Quote, Building2, TrendingUp, Award, CheckCircle } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

interface Review {
  id: number;
  author: string;
  position: string;
  company: string;
  industry: string;
  rating: number;
  quote: string;
  results: {
    metric: string;
    value: string;
  }[];
  avatar: string;
  verified: boolean;
}

const Testimonial: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviews: Review[] = [
    {
      id: 1,
      author: '김철수',
      position: 'CTO',
      company: '현대자동차',
      industry: '자동차',
      rating: 5,
      quote: 'GrowAI-MAP의 예측 유지보수 솔루션은 우리의 다운타임을 40% 줄였습니다. 투자 수익률은 6개월 만에 달성했습니다.',
      results: [
        { metric: '다운타임 감소', value: '40%' },
        { metric: 'ROI 달성', value: '6개월' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true
    },
    {
      id: 2,
      author: '이영희',
      position: '생산관리 이사',
      company: 'LG전자',
      industry: '전자',
      rating: 5,
      quote: 'AI 비전 검사 시스템 도입 후 불량률이 절반으로 줄었고, 품질 관리 인력을 30% 절감할 수 있었습니다.',
      results: [
        { metric: '불량률 감소', value: '50%' },
        { metric: '인력 절감', value: '30%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    {
      id: 3,
      author: '박민수',
      position: '스마트팩토리 팀장',
      company: 'SK하이닉스',
      industry: '반도체',
      rating: 5,
      quote: '실시간 데이터 분석으로 설비 가동률이 15% 향상되었고, 예상치 못한 고장이 80% 감소했습니다.',
      results: [
        { metric: '가동률 향상', value: '15%' },
        { metric: '고장 감소', value: '80%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=33',
      verified: true
    },
    {
      id: 4,
      author: '정수연',
      position: 'CEO',
      company: '중소제조A',
      industry: '기계',
      rating: 5,
      quote: '중소기업에게 맞춤형 솔루션을 제공해주셔서 감사합니다. 초기 투자 부담 없이 단계별로 도입할 수 있었습니다.',
      results: [
        { metric: '생산성 증가', value: '25%' },
        { metric: '에너지 절감', value: '20%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=9',
      verified: true
    },
    {
      id: 5,
      author: '최동욱',
      position: '공장장',
      company: '포스코',
      industry: '철강',
      rating: 5,
      quote: 'ESG 경영 목표 달성에 큰 도움이 되었습니다. CO2 배출량 30% 감축과 동시에 생산성도 향상되었습니다.',
      results: [
        { metric: 'CO2 감축', value: '30%' },
        { metric: '생산성 향상', value: '18%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=68',
      verified: true
    },
    {
      id: 6,
      author: '강민지',
      position: '디지털혁신 본부장',
      company: '한화',
      industry: '화학',
      rating: 5,
      quote: '데이터 기반 의사결정이 가능해졌고, 전사적으로 디지털 전환을 가속화할 수 있었습니다.',
      results: [
        { metric: '의사결정 속도', value: '3배' },
        { metric: '데이터 활용률', value: '90%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=45',
      verified: true
    },
    {
      id: 7,
      author: '윤재호',
      position: '품질보증 부장',
      company: '두산',
      industry: '중공업',
      rating: 5,
      quote: '협동로봇 도입으로 작업자 안전사고가 제로가 되었고, 작업 효율은 오히려 35% 증가했습니다.',
      results: [
        { metric: '안전사고', value: '0건' },
        { metric: '작업 효율', value: '+35%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=52',
      verified: true
    },
    {
      id: 8,
      author: '서지원',
      position: 'IT 담당',
      company: '스타트업D',
      industry: '식품',
      rating: 5,
      quote: '스타트업도 쉽게 도입할 수 있는 합리적인 가격과 빠른 구축 속도가 인상적이었습니다.',
      results: [
        { metric: '구축 기간', value: '2주' },
        { metric: '비용 절감', value: '60%' }
      ],
      avatar: 'https://i.pravatar.cc/150?img=27',
      verified: true
    }
  ];

  const categories = [
    { id: 'all', label: '전체', count: reviews.length },
    { id: '자동차', label: '자동차', count: reviews.filter(r => r.industry === '자동차').length },
    { id: '전자', label: '전자', count: reviews.filter(r => r.industry === '전자').length },
    { id: '반도체', label: '반도체', count: reviews.filter(r => r.industry === '반도체').length },
    { id: '기계', label: '중소기업', count: reviews.filter(r => r.industry === '기계').length }
  ];

  const filteredReviews = selectedCategory === 'all' 
    ? reviews 
    : reviews.filter(r => r.industry === selectedCategory);

  return (
    <section className="py-12 animate-fade-in-up">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Customer Success Stories</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">
          고객 성공 사례
        </h2>
        <p className="text-gray-400 text-lg">
          실제 제조 현장에서 검증된 성과를 확인하세요
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-main shadow-lg shadow-primary/30'
                : 'bg-surface border border-border text-gray-400 hover:border-primary/50'
            }`}
          >
            {category.label}
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>

      {/* 리뷰 그리드 (인스타그램 스타일) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review, index) => (
          <div
            key={review.id}
            className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 card-3d group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* 카드 헤더 */}
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
                      <CheckCircle className="w-4 h-4 text-main" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white truncate">{review.author}</h4>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {review.position} · {review.company}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
            </div>

            {/* 카드 본문 */}
            <div className="p-5 space-y-4">
              {/* 인용문 */}
              <div className="relative">
                <Quote className="w-6 h-6 text-primary/20 absolute -top-2 -left-2" />
                <p className="text-sm text-gray-300 leading-relaxed pl-4">
                  {review.quote}
                </p>
              </div>

              {/* 성과 지표 */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                {review.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-main rounded-lg p-3 text-center border border-border hover:border-primary/30 transition"
                  >
                    <div className="text-2xl font-bold text-primary mb-1">
                      {result.value}
                    </div>
                    <div className="text-xs text-gray-400">
                      {result.metric}
                    </div>
                  </div>
                ))}
              </div>

              {/* 산업 태그 */}
              <div className="flex items-center gap-2 pt-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">
                  {review.industry} 산업
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 통계 요약 */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: '평균 ROI', value: '245%', color: 'text-green-500' },
          { icon: Award, label: '고객 만족도', value: '98%', color: 'text-primary' },
          { icon: CheckCircle, label: '프로젝트 성공률', value: '100%', color: 'text-blue-500' },
          { icon: Building2, label: '도입 기업', value: '500+', color: 'text-yellow-500' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-surface border border-border rounded-xl p-6 text-center hover:border-primary/50 transition card-3d"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl">
          <p className="text-lg text-gray-300">
            귀사도 성공 사례의 주인공이 될 수 있습니다
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold hover:opacity-90 transition magnetic-hover"
          >
            무료 상담 신청하기
          </button>
        </div>
      </div>

      {/* 상담 신청 모달 */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Testimonial;

