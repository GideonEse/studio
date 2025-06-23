export type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'doctor';
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
  
  export const users: User[] = [
    { id: 'usr_1', name: 'Alice Johnson', email: 'alice@university.edu', role: 'student' },
    { id: 'usr_2', name: 'Bob Williams', email: 'bob@university.edu', role: 'student' },
    { id: 'usr_3', name: 'Dr. Carol White', email: 'carol.w@university.edu', role: 'doctor' },
    { id: 'usr_4', name: 'David Green', email: 'david.g@university.edu', role: 'doctor' },
    { id: 'usr_5', name: 'Eve Black', email: 'eve@university.edu', role: 'student' },
  ];
  
  export const appointments: Appointment[] = [
    {
      id: 'apt_1',
      studentName: 'Alice Johnson',
      studentId: 'usr_1',
      dateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
      reason: 'General check-up',
      status: 'Confirmed',
    },
    {
      id: 'apt_2',
      studentName: 'Bob Williams',
      studentId: 'usr_2',
      dateTime: new Date(new Date().setDate(new Date().getDate() + 3)),
      reason: 'Flu-like symptoms, sore throat and headache.',
      status: 'Confirmed',
    },
    {
        id: 'apt_3',
        studentName: 'Eve Black',
        studentId: 'usr_5',
        dateTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        reason: 'Follow-up consultation.',
        status: 'Confirmed',
      },
  ];
  
  export const inquiries: Inquiry[] = [
    {
      id: 'inq_1',
      studentName: 'Bob Williams',
      studentId: 'usr_2',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      question: 'I have a mild fever and a cough. Should I be concerned about COVID-19?',
      status: 'Pending',
    },
    {
      id: 'inq_2',
      studentName: 'Alice Johnson',
      studentId: 'usr_1',
      date: new Date(new Date().setDate(new Date().getDate() - 3)),
      question: 'What are the operating hours for the pharmacy on campus during the weekend?',
      response: 'The campus pharmacy is open from 9 AM to 1 PM on Saturdays and is closed on Sundays. Please let us know if you have any other questions.',
      status: 'Resolved',
    },
    {
        id: 'inq_3',
        studentName: 'Eve Black',
        studentId: 'usr_5',
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        question: 'I\'m feeling very anxious and depressed lately, it\'s affecting my studies. I don\'t know what to do.',
        status: 'Pending',
      },
  ];
  