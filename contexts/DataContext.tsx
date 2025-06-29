import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Patient, Scholar, Center, DashboardStats, Attendance, LearningOutcome, OPDWheeInstance } from '@/types';

interface DataContextType {
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  
  // Attendance
  attendance: Attendance[];
  markAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  
  // Learning Outcomes
  learningOutcomes: LearningOutcome[];
  addLearningOutcome: (outcome: Omit<LearningOutcome, 'id'>) => void;
  
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  
  // OPD on Wheels
  opdWheels: OPDWheeInstance[];
  addOPDWheel: (opd: Omit<OPDWheeInstance, 'id'>) => void;
  
  // Scholars
  scholars: Scholar[];
  addScholar: (scholar: Omit<Scholar, 'id'>) => void;
  
  // Centers
  centers: Center[];
  addCenter: (center: Omit<Center, 'id'>) => void;
  
  // Dashboard Stats
  dashboardStats: DashboardStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Aarav Kumar',
    age: 10,
    grade: '5th',
    parentName: 'Ramesh Kumar',
    parentPhone: '+91 9876543210',
    address: '123 Main Street, Delhi',
    centerId: 'center1',
    enrollmentDate: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'Priya Singh',
    age: 8,
    grade: '3rd',
    parentName: 'Suresh Singh',
    parentPhone: '+91 9876543211',
    address: '456 Park Road, Mumbai',
    centerId: 'center1',
    enrollmentDate: '2024-02-01',
    isActive: true,
  },
];

const mockCenters: Center[] = [
  {
    id: 'center1',
    name: 'EKDKN Learning Center - Delhi',
    type: 'education',
    address: '123 Education Street, Delhi',
    inchargeName: 'Priya Sharma',
    inchargePhone: '+91 9876543211',
    studentsCount: 45,
    teachersCount: 3,
    isActive: true,
  },
  {
    id: 'center2',
    name: 'EKDKN Medical Center - Mumbai',
    type: 'opd',
    address: '456 Health Avenue, Mumbai',
    inchargeName: 'Dr. Amit Patel',
    inchargePhone: '+91 9876543212',
    isActive: true,
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [opdWheels, setOPDWheels] = useState<OPDWheeInstance[]>([]);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [centers, setCenters] = useState<Center[]>(mockCenters);

  const dashboardStats: DashboardStats = {
    totalStudents: students.length,
    totalTeachers: 12,
    totalDoctors: 8,
    totalVolunteers: 45,
    totalDonations: 1250000,
    totalCenters: centers.length,
    totalScholars: scholars.length,
    monthlyGrowth: {
      students: 15.5,
      donations: 8.3,
    },
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const markAttendance = (attendanceRecord: Omit<Attendance, 'id'>) => {
    const newAttendance: Attendance = {
      ...attendanceRecord,
      id: Date.now().toString(),
    };
    setAttendance(prev => [...prev, newAttendance]);
  };

  const addLearningOutcome = (outcome: Omit<LearningOutcome, 'id'>) => {
    const newOutcome: LearningOutcome = {
      ...outcome,
      id: Date.now().toString(),
    };
    setLearningOutcomes(prev => [...prev, newOutcome]);
  };

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addOPDWheel = (opd: Omit<OPDWheeInstance, 'id'>) => {
    const newOPD: OPDWheeInstance = {
      ...opd,
      id: Date.now().toString(),
    };
    setOPDWheels(prev => [...prev, newOPD]);
  };

  const addScholar = (scholar: Omit<Scholar, 'id'>) => {
    const newScholar: Scholar = {
      ...scholar,
      id: Date.now().toString(),
    };
    setScholars(prev => [...prev, newScholar]);
  };

  const addCenter = (center: Omit<Center, 'id'>) => {
    const newCenter: Center = {
      ...center,
      id: Date.now().toString(),
    };
    setCenters(prev => [...prev, newCenter]);
  };

  return (
    <DataContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      attendance,
      markAttendance,
      learningOutcomes,
      addLearningOutcome,
      patients,
      addPatient,
      opdWheels,
      addOPDWheel,
      scholars,
      addScholar,
      centers,
      addCenter,
      dashboardStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}