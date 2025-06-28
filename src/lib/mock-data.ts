export type User = {
    id: string;
    name: string;
    matricNumber: string;
    password?: string;
    role: 'student' | 'doctor';
  };
  
  export type Appointment = {
    id: string;
    studentName: string;
    studentId: string;
    dateTime: Date;
    reason: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    doctorMessage?: string;
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
