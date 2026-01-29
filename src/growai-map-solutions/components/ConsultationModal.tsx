import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, MessageSquare, Calendar, CheckCircle, Sparkles } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    industry: '',
    employees: '',
    concerns: [] as string[],
    message: '',
    preferredDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const industries = [
    '자동차', '전자', '반도체', '화학', '철강', '기계', '식품', '의약', '섬유', '기타'
  ];

  const employeeRanges = [
    '50명 미만', '50-100명', '100-300명', '300-500명', '500-1000명', '1000명 이상'
  ];

  const concernOptions = [
    { id: 'quality', label: '품질 관리' },
    { id: 'facility', label: '설비 관리' },
    { id: 'process', label: '공정 효율' },
    { id: 'safety', label: '안전 관리' },
    { id: 'hr', label: '인력 관리' },
    { id: 'energy', label: '에너지 절감' },
    { id: 'esg', label: 'ESG 경영' },
    { id: 'digital', label: '디지털 전환' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConcernToggle = (concernId: string) => {
    setFormData({
      ...formData,
      concerns: formData.concerns.includes(concernId)
        ? formData.concerns.filter(c => c !== concernId)
        : [...formData.concerns, concernId]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 시뮬레이션: 2초 후 성공
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          company: '',
          position: '',
          email: '',
          phone: '',
          industry: '',
          employees: '',
          concerns: [],
          message: '',
          preferredDate: ''
        });
        onClose();
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 모달 */}
      <div className="relative bg-surface border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar animate-scale-in">
        {/* 헤더 */}
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">무료 상담 신청</h2>
              <p className="text-sm text-gray-400">전문 컨설턴트가 24시간 내 연락드립니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-main border border-border hover:border-primary/50 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 성공 메시지 */}
        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">신청이 완료되었습니다!</h3>
            <p className="text-gray-400 mb-6">
              담당 컨설턴트가 영업일 기준 24시간 내에<br />
              연락드리겠습니다.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">확인 이메일이 발송되었습니다</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                기본 정보
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="홍길동"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    직책
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="CTO, 공장장, 팀장 등"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  placeholder="주식회사 GrowAI"
                  className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@company.com"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* 회사 정보 */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                회사 정보
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    산업 분야
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white focus:border-primary focus:outline-none transition"
                  >
                    <option value="">선택하세요</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    직원 수
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white focus:border-primary focus:outline-none transition"
                  >
                    <option value="">선택하세요</option>
                    {employeeRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 관심 분야 */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                관심 분야 (복수 선택 가능)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {concernOptions.map(concern => (
                  <button
                    key={concern.id}
                    type="button"
                    onClick={() => handleConcernToggle(concern.id)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                      formData.concerns.includes(concern.id)
                        ? 'bg-primary border-primary text-white'
                        : 'bg-main border-border text-gray-400 hover:border-primary/50'
                    }`}
                  >
                    {concern.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 상담 희망일 */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                상담 희망일
              </h3>

              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white focus:border-primary focus:outline-none transition"
              />
            </div>

            {/* 문의 내용 */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                문의 내용
              </h3>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="현재 겪고 계신 문제나 도입을 고려 중인 솔루션에 대해 자유롭게 작성해주세요."
                className="w-full px-4 py-3 bg-main border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition resize-none"
              ></textarea>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>제출 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>무료 상담 신청하기</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                제출하시면 <a href="#" className="text-primary hover:underline">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
