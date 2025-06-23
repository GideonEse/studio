// src/contexts/auth-context.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { users, type User } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: User | null;
  login: (matricNumber: string, password?: string) => Promise<User | null>;
  logout: () => void;
  register: (newUser: Omit<User, 'id'>) => Promise<User | null>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const router = useRouter();

  const login = async (matricNumber: string, password?: string): Promise<User | null> => {
    // In a real app, you'd fetch the user from a database
    const user = users.find(u => u.matricNumber === matricNumber && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const register = async (newUserPartial: Omit<User, 'id'>): Promise<User | null> => {
    const newUser: User = {
        id: `usr_${Date.now()}`,
        ...newUserPartial
    };
    users.push(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
