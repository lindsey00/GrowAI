import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'consultant' | 'student' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem('growai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // 시뮬레이션: 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 데모 사용자 (실제로는 백엔드에서 검증)
    let demoUser: User;
    
    if (email.includes('admin')) {
      demoUser = {
        id: '1',
        name: '김관리자',
        email: 'admin@growai.com',
        role: 'admin',
        company: 'GrowAI HQ',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      };
    } else if (email.includes('consultant')) {
      demoUser = {
        id: '2',
        name: '이컨설턴트',
        email: 'consultant@growai.com',
        role: 'consultant',
        company: 'GrowAI Consulting',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=consultant'
      };
    } else {
      demoUser = {
        id: '3',
        name: '박학생',
        email: 'student@company.com',
        role: 'student',
        company: '현대자동차',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'
      };
    }

    setUser(demoUser);
    localStorage.setItem('growai_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('growai_user');
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
