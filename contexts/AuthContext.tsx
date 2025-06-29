import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'teacher' | 'doctor';
  centerId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@ekdkn.org',
    phone: '+91 9876543210',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'teacher@ekdkn.org',
    phone: '+91 9876543211',
    role: 'teacher',
    centerId: 'center1',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Dr. Amit Patel',
    email: 'doctor@ekdkn.org',
    phone: '+91 9876543212',
    role: 'doctor',
    centerId: 'center2',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      centerId: userData.centerId || undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
      language,
      setLanguage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}