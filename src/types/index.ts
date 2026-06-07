export interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  phone_number?: string;
  address?: string;
  national_id?: string;
  role: 'candidate' | 'admin';
  is_locked: boolean;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Major {
  id: string;
  name: string;
  university_id: string;
  created_at: string;
}

export interface SubjectCombination {
  id: string;
  name: string;
  code: string;
  major_id: string;
  subjects: string[];
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  university_id: string;
  major_id: string;
  subject_combination_id: string;
  exam_score: number;
  priority_category: string;
  notes: string;
  transcript_file?: string;
  id_card_file?: string;
  status: 'pending' | 'approved' | 'rejected';
  submission_date: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  is_read: boolean;
  created_at: string;
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