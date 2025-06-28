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
  updateAppointment: (updatedAppointment: Appointment) => void;
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
  const [isLoaded, setIsLoaded] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    try {
        const savedUsers = localStorage.getItem('hms_users');
        if (savedUsers) setUserList(JSON.parse(savedUsers));

        const savedAppointments = localStorage.getItem('hms_appointments');
        if (savedAppointments) {
            setAppointments(JSON.parse(savedAppointments).map((a: any) => ({...a, dateTime: new Date(a.dateTime)})));
        }

        const savedInquiries = localStorage.getItem('hms_inquiries');
        if (savedInquiries) {
            setInquiries(JSON.parse(savedInquiries).map((i: any) => ({...i, date: new Date(i.date)})));
        }

        const savedCurrentUser = localStorage.getItem('hms_currentUser');
        if (savedCurrentUser) {
            setCurrentUser(JSON.parse(savedCurrentUser));
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('hms_users', JSON.stringify(userList));
  }, [userList, isLoaded]);

  React.useEffect(() => {
      if (!isLoaded) return;
      localStorage.setItem('hms_appointments', JSON.stringify(appointments));
  }, [appointments, isLoaded]);

  React.useEffect(() => {
      if (!isLoaded) return;
      localStorage.setItem('hms_inquiries', JSON.stringify(inquiries));
  }, [inquiries, isLoaded]);

  React.useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
        localStorage.setItem('hms_currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('hms_currentUser');
    }
  }, [currentUser, isLoaded]);

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
    localStorage.removeItem('hms_currentUser');
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

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
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
        updateAppointment,
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
