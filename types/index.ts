export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'teacher' | 'doctor';
  profileImage?: string;
  centerId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentName: string;
  parentPhone: string;
  address: string;
  centerId: string;
  enrollmentDate: string;
  isActive: boolean;
}

export interface Attendance {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface LearningOutcome {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  examType: string;
  date: string;
  certificate?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  address: string;
  opdEventId: string;
  visitDate: string;
  diagnosis: string;
  prescription: string;
  doctorId: string;
}

export interface OPDWheeInstance {
  id: string;
  location: string;
  inchargeName: string;
  inchargePhone: string;
  date: string;
  patientsCount: number;
  doctorId: string;
}

export interface Center {
  id: string;
  name: string;
  type: 'education' | 'opd';
  address: string;
  inchargeName: string;
  inchargePhone: string;
  studentsCount?: number;
  teachersCount?: number;
  isActive: boolean;
}

export interface Scholar {
  id: string;
  name: string;
  age: number;
  education: string;
  amount: number;
  awardedDate: string;
  status: 'awarded' | 'pending' | 'completed';
  documents: string[];
}

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  images: string[];
  submittedBy: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalDoctors: number;
  totalVolunteers: number;
  totalDonations: number;
  totalCenters: number;
  totalScholars: number;
  monthlyGrowth: {
    students: number;
    donations: number;
  };
}