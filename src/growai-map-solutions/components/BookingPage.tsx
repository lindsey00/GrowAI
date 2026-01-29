import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Building2, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface BookingPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  selectedDate: string;
  selectedTime: string;
  message: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'date' | 'time' | 'info' | 'success'>('date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    selectedDate: '',
    selectedTime: '',
    message: ''
  });

  // 사용 가능한 시간대 (9:00 - 18:00, 30분 단위)
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // 달력 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6; // 주말 제외
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, selectedDate: date.toISOString() });
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, selectedTime: time });
    setStep('info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 시뮬레이션: 2초 후 성공
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      
      // 5초 후 자동 닫기
      setTimeout(() => {
        onClose();
        // 초기화
        setStep('date');
        setBookingData({
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          selectedDate: '',
          selectedTime: '',
          message: ''
        });
      }, 5000);
    }, 2000);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* 예약 페이지 */}
      <div className="relative bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar animate-scale-in">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">무료 상담 예약</h2>
                <p className="text-white/80 text-sm">전문가와 30분 AI 혁신 여정을 시작하세요</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* 진행 단계 */}
          {step !== 'success' && (
            <div className="mt-6 flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full transition ${step === 'date' || step === 'time' || step === 'info' ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition ${step === 'time' || step === 'info' ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition ${step === 'info' ? 'bg-white' : 'bg-white/30'}`}></div>
            </div>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="p-8">
          {/* Step 1: 날짜 선택 */}
          {step === 'date' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">상담 날짜를 선택하세요</h3>
                <p className="text-gray-400">평일 중 편하신 날짜를 선택해주세요</p>
              </div>

              {/* 달력 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="w-10 h-10 rounded-full bg-main border border-border hover:border-primary/50 flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="text-xl font-bold text-white">
                  {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                </h4>
                <button
                  onClick={goToNextMonth}
                  className="w-10 h-10 rounded-full bg-main border border-border hover:border-primary/50 flex items-center justify-center transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div key={index} className="text-center text-sm font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 달력 */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  const isAvailable = isDateAvailable(date);
                  const isToday = date && date.toDateString() === new Date().toDateString();
                  
                  return (
                    <button
                      key={index}
                      disabled={!isAvailable}
                      onClick={() => date && handleDateSelect(date)}
                      className={`aspect-square rounded-xl text-sm font-medium transition ${
                        !date
                          ? 'invisible'
                          : isAvailable
                          ? 'bg-main border border-border hover:border-primary hover:bg-primary/10 text-white'
                          : 'bg-main/50 border border-border/50 text-gray-600 cursor-not-allowed'
                      } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    >
                      {date && date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  평일(월-금) 09:00 - 18:00 예약 가능
                </p>
              </div>
            </div>
          )}

          {/* Step 2: 시간 선택 */}
          {step === 'time' && (
            <div className="animate-fade-in-up">
              <button
                onClick={() => setStep('date')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">날짜 다시 선택</span>
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">상담 시간을 선택하세요</h3>
                <p className="text-gray-400">
                  {bookingData.selectedDate && formatDate(new Date(bookingData.selectedDate))}
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="py-4 px-6 rounded-xl bg-main border border-border hover:border-primary hover:bg-primary/10 text-white font-medium transition group"
                  >
                    <Clock className="w-5 h-5 mx-auto mb-2 text-gray-400 group-hover:text-primary transition" />
                    <span className="text-lg">{time}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  30분 전문가 상담 (무료)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: 정보 입력 */}
          {step === 'info' && (
            <div className="animate-fade-in-up">
              <button
                onClick={() => setStep('time')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">시간 다시 선택</span>
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">정보를 입력하세요</h3>
                <p className="text-gray-400">
                  {bookingData.selectedDate && formatDate(new Date(bookingData.selectedDate))} • {bookingData.selectedTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={bookingData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="홍길동"
                        className="w-full pl-10 pr-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="example@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="010-1234-5678"
                        className="w-full pl-10 pr-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      회사명 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="company"
                        value={bookingData.company}
                        onChange={handleInputChange}
                        required
                        placeholder="주식회사 GrowAI"
                        className="w-full pl-10 pr-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    직책
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={bookingData.position}
                    onChange={handleInputChange}
                    placeholder="예: 생산 담당 이사, CTO"
                    className="w-full px-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    상담 내용
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <textarea
                      name="message"
                      value={bookingData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="상담하고 싶은 내용을 간단히 적어주세요 (선택사항)"
                      className="w-full pl-10 pr-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      신용카드 불필요 • 30분 전문가 세션 • 확인 이메일이 발송됩니다
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>예약 중...</span>
                    </div>
                  ) : (
                    '무료 상담 예약하기'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: 성공 */}
          {step === 'success' && (
            <div className="py-12 text-center animate-fade-in-up">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">예약이 완료되었습니다!</h3>
              <p className="text-gray-400 mb-8 text-lg">
                확인 이메일이 <span className="text-primary font-semibold">{bookingData.email}</span>로 발송되었습니다.
              </p>

              <div className="max-w-md mx-auto bg-main border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-gray-400">날짜</span>
                  <span className="text-white font-semibold">
                    {bookingData.selectedDate && new Date(bookingData.selectedDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-gray-400">시간</span>
                  <span className="text-white font-semibold">{bookingData.selectedTime}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-gray-400">이름</span>
                  <span className="text-white font-semibold">{bookingData.name}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400">회사</span>
                  <span className="text-white font-semibold">{bookingData.company}</span>
                </div>
              </div>

              <p className="mt-8 text-sm text-gray-500">
                담당 컨설턴트가 영업일 기준 24시간 내에 연락드리겠습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
