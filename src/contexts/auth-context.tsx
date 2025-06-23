// src/contexts/auth-context.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { users as initialUsers, appointments as initialAppointments, inquiries as initialInquiries, type User, type Appointment, type Inquiry } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: User | null;
  login: (matricNumber: string, password?: string) => Promise<User | null>;
  logout: () => void;
  register: (newUser: Omit<User, 'id'>) => Promise<User | null>;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiry: (updatedInquiry: Inquiry) => void;
  users: User[];
  deleteUser: (userId: string) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [userList, setUserList] = React.useState<User[]>(initialUsers);
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>(initialInquiries);
  const router = useRouter();

  const login = async (matricNumber: string, password?: string): Promise<User | null> => {
    const user = userList.find(u => u.matricNumber === matricNumber && u.password === password);
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
    setUserList(prev => [...prev, newUser]);
    return newUser;
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };
  
  const addInquiry = (inquiry: Inquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
  };

  const updateInquiry = (updatedInquiry: Inquiry) => {
    setInquiries(prev => prev.map(i => i.id === updatedInquiry.id ? updatedInquiry : i));
  }

  const deleteUser = (userId: string) => {
    setUserList(prev => prev.filter(u => u.id !== userId));
  }


  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        login, 
        logout, 
        register, 
        appointments, 
        addAppointment,
        inquiries,
        addInquiry,
        updateInquiry,
        users: userList,
        deleteUser
    }}>
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
