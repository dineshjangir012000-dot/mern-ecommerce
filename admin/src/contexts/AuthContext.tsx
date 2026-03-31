import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin data - replace with real API calls to your Express backend
const MOCK_ADMIN: Admin = {
  id: 'admin-001',
  email: 'admin@example.com',
  name: 'John Admin',
  role: 'SUPER_ADMIN',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session (mock implementation)
    const storedAdmin = localStorage.getItem('adminSession');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock login - replace with actual API call to your Express backend
    // Example: const response = await fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    if (email === 'admin@example.com' && password === 'admin123') {
      setAdmin(MOCK_ADMIN);
      localStorage.setItem('adminSession', JSON.stringify(MOCK_ADMIN));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminSession');
    // Call your Express logout endpoint here
    // Example: await fetch('/api/admin/logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
