export type User = {
    id: string;
    name: string;
    matricNumber: string;
    password?: string;
    role: 'student' | 'doctor' | 'staff';
  };
  
  export type Appointment = {
    id: string;
    studentName: string;
    studentId: string;
    dateTime: Date;
    reason: string;
    status: 'Confirmed' | 'Completed' | 'Cancelled';
  };
  
  export type Inquiry = {
    id: string;
    studentName: string;
    studentId: string;
    date: Date;
    question: string;
    response?: string;
    status: 'Pending' | 'Resolved';
  };
  
  export const users: User[] = [];
  
  export const appointments: Appointment[] = [];
  
  export const inquiries: Inquiry[] = [];
