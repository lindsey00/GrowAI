import React, { useState } from 'react';
import { 
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  CheckCircle,
  Play,
  Download,
  MessageCircle,
  ChevronRight,
  Star
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  duration: string;
  instructor: string;
  rating: number;
  thumbnail: string;
}

const LMSLayout: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'AI 기반 예측 유지보수 입문',
      category: 'Predictive Maintenance',
      progress: 65,
      duration: '4시간',
      instructor: '김AI 박사',
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=AI+Maintenance'
    },
    {
      id: '2',
      title: '스마트 팩토리 비전 검사 시스템',
      category: 'Quality Control',
      progress: 30,
      duration: '6시간',
      instructor: '이비전 교수',
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Vision+AI'
    },
    {
      id: '3',
      title: '공정 최적화를 위한 데이터 분석',
      category: 'Process Optimization',
      progress: 0,
      duration: '5시간',
      instructor: '박데이터 연구원',
      rating: 4.7,
      thumbnail: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Data+Analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-main">
      {/* LMS 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">GrowAI 학습 센터</h1>
                <p className="text-sm text-gray-400">Manufacturing AI 전문 교육 플랫폼</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">학습 진행률</p>
                <p className="text-lg font-bold text-primary">32%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                박
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 코스 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 진행 중인 코스 */}
            <div>
              <h2 className="text-xl font-bold mb-4">진행 중인 코스</h2>
              <div className="space-y-4">
                {courses.filter(c => c.progress > 0 && c.progress < 100).map((course) => (
                  <div 
                    key={course.id}
                    onClick={() => setActiveCourse(course)}
                    className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-400">{course.instructor}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                            {course.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {course.rating}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">진행률</span>
                            <span className="font-bold text-primary">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-main rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 코스 */}
            <div>
              <h2 className="text-xl font-bold mb-4">추천 코스</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.filter(c => c.progress === 0).map((course) => (
                  <div 
                    key={course.id}
                    className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition cursor-pointer"
                  >
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{course.instructor}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                          시작하기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 학습 정보 */}
          <div className="space-y-6">
            {/* 학습 통계 */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">학습 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">완료한 코스</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">진행 중</span>
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">총 학습 시간</span>
                  <span className="font-bold">8.5시간</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">획득 인증서</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">최근 활동</h3>
              <div className="space-y-3">
                {[
                  { action: '강의 시청', course: 'AI 기반 예측 유지보수', time: '2시간 전' },
                  { action: '퀴즈 완료', course: '스마트 팩토리 비전 검사', time: '1일 전' },
                  { action: '코스 등록', course: '공정 최적화 데이터 분석', time: '2일 전' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-main rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.course}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 인증서 */}
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="font-bold">인증서 획득</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                코스를 완료하고 전문 인증서를 받으세요
              </p>
              <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                인증서 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 비디오 플레이어 모달 (활성 코스 선택 시) */}
      {activeCourse && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-4xl w-full overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center">
              <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition">
                <Play className="w-10 h-10 text-white ml-1" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{activeCourse.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{activeCourse.instructor}</p>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
                  계속 학습하기
                </button>
                <button 
                  onClick={() => setActiveCourse(null)}
                  className="px-6 py-3 bg-main border border-border rounded-lg font-medium hover:bg-surface transition"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LMSLayout;
