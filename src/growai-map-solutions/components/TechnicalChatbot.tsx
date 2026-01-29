import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, Database, Zap } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
}

interface RAGDocument {
  id: string;
  title: string;
  content: string;
  partner: string;
  category: string;
  relevanceScore?: number;
}

const TechnicalChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I am your GrowAI technical assistant powered by RAG (Retrieval-Augmented Generation). I have indexed 150+ partner technical documents. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RAG 문서 데이터베이스 (실제로는 벡터 DB에서 검색)
  const ragDocuments: RAGDocument[] = [
    {
      id: '1',
      title: 'Predictive Maintenance Implementation Guide',
      content: 'Our predictive maintenance system uses machine learning algorithms to analyze sensor data and predict equipment failures 48-72 hours in advance. The system achieves 95% accuracy in failure prediction...',
      partner: 'Global AX Solutions',
      category: 'Predictive Maintenance'
    },
    {
      id: '2',
      title: 'Vision Inspection System Technical Specs',
      content: 'The AI-powered vision inspection system processes 1000 images per minute with 99.8% defect detection accuracy. It uses convolutional neural networks trained on 10 million labeled images...',
      partner: 'Smart Factory Co.',
      category: 'Quality Control'
    },
    {
      id: '3',
      title: 'ESG Optimization Best Practices',
      content: 'Our ESG optimization platform reduces energy consumption by 30% on average through real-time monitoring and AI-driven recommendations. It tracks carbon emissions, water usage, and waste management...',
      partner: 'Green Energy AI',
      category: 'ESG'
    },
    {
      id: '4',
      title: 'Process Automation ROI Calculator',
      content: 'Typical ROI for process automation ranges from 6-12 months. Key factors include current manual labor costs, error rates, and production volume. Our clients see average productivity gains of 40%...',
      partner: 'AutoMate Systems',
      category: 'Process Optimization'
    },
    {
      id: '5',
      title: 'Quality Control Integration Manual',
      content: 'Integration with existing MES systems takes 2-4 weeks. The system supports standard protocols including OPC UA, MQTT, and REST APIs. Real-time dashboards provide instant quality metrics...',
      partner: 'Precision Tech Inc.',
      category: 'Quality Control'
    }
  ];

  // RAG 검색 함수 (간단한 키워드 매칭, 실제로는 벡터 유사도 검색)
  const retrieveRelevantDocs = (query: string): RAGDocument[] => {
    const keywords = query.toLowerCase().split(' ');
    
    return ragDocuments
      .map(doc => {
        const titleMatch = keywords.filter(kw => doc.title.toLowerCase().includes(kw)).length;
        const contentMatch = keywords.filter(kw => doc.content.toLowerCase().includes(kw)).length;
        const categoryMatch = keywords.filter(kw => doc.category.toLowerCase().includes(kw)).length;
        
        const relevanceScore = (titleMatch * 3) + (contentMatch * 2) + (categoryMatch * 2);
        
        return { ...doc, relevanceScore };
      })
      .filter(doc => doc.relevanceScore && doc.relevanceScore > 0)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 3);
  };

  // RAG 기반 응답 생성
  const generateRAGResponse = (query: string, relevantDocs: RAGDocument[]): string => {
    if (relevantDocs.length === 0) {
      return "I couldn't find specific technical documents matching your query. Could you please rephrase or ask about predictive maintenance, quality control, ESG optimization, or process automation?";
    }

    // 문서 내용 기반 응답 생성 (실제로는 LLM 사용)
    const context = relevantDocs.map(doc => doc.content).join('\n\n');
    
    // 간단한 규칙 기반 응답 (실제로는 Gemini/GPT 사용)
    if (query.toLowerCase().includes('roi') || query.toLowerCase().includes('cost')) {
      return `Based on our technical documentation:\n\n${relevantDocs[0].content.substring(0, 200)}...\n\nWould you like more specific ROI calculations for your use case?`;
    }
    
    if (query.toLowerCase().includes('accuracy') || query.toLowerCase().includes('performance')) {
      return `According to ${relevantDocs[0].partner}'s technical specs:\n\n${relevantDocs[0].content.substring(0, 200)}...\n\nShall I provide more detailed performance metrics?`;
    }

    return `I found relevant information from ${relevantDocs.length} technical document(s):\n\n${relevantDocs[0].content.substring(0, 250)}...\n\nWould you like me to elaborate on any specific aspect?`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // RAG 검색
    const relevantDocs = retrieveRelevantDocs(inputValue);
    
    // 로그 기록
    logTest('RAG Search', {
      query: inputValue,
      docsFound: relevantDocs.length,
      topDoc: relevantDocs[0]?.title,
      relevanceScore: relevantDocs[0]?.relevanceScore
    });

    // 시뮬레이션: 1.5초 후 응답
    setTimeout(() => {
      const response = generateRAGResponse(inputValue, relevantDocs);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        sources: relevantDocs.map(doc => `${doc.partner} - ${doc.title}`)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // 로그 기록
      logTest('RAG Response', {
        response: response.substring(0, 100) + '...',
        sourcesUsed: botMessage.sources
      });
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold">GrowAI Technical Assistant</h3>
        </div>
        <p className="text-xs opacity-90 flex items-center gap-1">
          <Database className="w-3 h-3" />
          RAG-powered by Gemini Pro • 150+ docs indexed
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {/* Sources (RAG) */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Sources:
                    </p>
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-primary" />
                        {source}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a technical question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by Gemini Pro with RAG
        </p>
      </form>
    </div>
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

export default TechnicalChatbot;
