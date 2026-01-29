import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 초기 대화 내용 (실제 대화 시뮬레이션)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I am your GrowAI technical assistant. I have studied 150+ partner technical documents. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 120000) // 2분 전
    },
    {
      id: 2,
      text: 'How can I optimize my factory production line?',
      sender: 'user',
      timestamp: new Date(Date.now() - 90000) // 1.5분 전
    },
    {
      id: 3,
      text: 'Great question! Based on our technical documentation, I recommend implementing predictive maintenance systems. This can reduce downtime by up to 40%. Would you like me to explain the implementation process?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000) // 1분 전
    },
    {
      id: 4,
      text: 'Yes, please tell me more about the implementation.',
      sender: 'user',
      timestamp: new Date(Date.now() - 30000) // 30초 전
    },
    {
      id: 5,
      text: 'The implementation involves 3 key steps:\n\n1. **Sensor Integration**: Install IoT sensors on critical equipment\n2. **Data Collection**: Gather real-time performance data\n3. **AI Analysis**: Use machine learning to predict failures\n\nWould you like to schedule a consultation with our experts?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 10000) // 10초 전
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션 (1-2초 후)
    setTimeout(() => {
      const botResponses = [
        "Excellent question! Based on our 150+ partner documents, I can provide detailed insights on that topic. Let me search through our technical database...",
        "I understand your concern. This is a common challenge in manufacturing optimization. Our AI-powered solutions have helped 500+ companies address similar issues.",
        "That's a great point! Let me explain how our supply chain efficiency module can help. It uses real-time data analytics to optimize inventory levels and reduce costs by an average of 30%.",
        "Perfect! I recommend checking our predictive maintenance solutions. Our clients have seen ROI improvements of up to 245% within the first year. Would you like to schedule a demo?",
        "Based on your requirements, I suggest our quality control AI system. It can detect defects with 99.8% accuracy and reduce waste significantly. Shall I connect you with a specialist?"
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[150] w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform animate-bounce-slow"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
            5
          </span>
        </button>
      )}

      {/* 챗봇 윈도우 */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-[150] bg-surface border border-border rounded-2xl shadow-2xl transition-all ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } animate-scale-in`}
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">GrowAI Technical Assistant</h3>
                <p className="text-white/80 text-xs">RAG-powered by Gemini Pro</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* 메시지 영역 */}
              <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
                  >
                    {/* 아바타 */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'bot'
                          ? 'bg-gradient-to-br from-primary to-secondary'
                          : 'bg-gray-700'
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* 메시지 버블 */}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.sender === 'bot'
                          ? 'bg-main border border-border text-gray-300'
                          : 'bg-gradient-to-r from-primary to-secondary text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'bot' ? 'text-gray-500' : 'text-white/70'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 타이핑 인디케이터 */}
                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-main border border-border rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a technical question..."
                    className="flex-1 px-4 py-3 bg-main border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Gemini Pro • 150+ docs indexed
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
