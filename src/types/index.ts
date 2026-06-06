export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phoneNumber?: string;
  address?: string;
  nationalId?: string;
  role: 'candidate' | 'admin';
  isLocked: boolean;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Major {
  id: string;
  name: string;
  universityId: string;
  createdAt: string;
}

export interface SubjectCombination {
  id: string;
  name: string;
  code: string;
  majorId: string;
  subjects: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  universityId: string;
  majorId: string;
  subjectCombinationId: string;
  examScore: number;
  priorityCategory: string;
  notes: string;
  transcriptFile?: string;
  idCardFile?: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isRead: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}