import { supabase } from '../utils/supabase';
import { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Direct query to users table - no Supabase Auth
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .eq('password', credentials.password)
      .eq('is_locked', false);

    if (error) {
      console.error('Login error:', error);
      throw new Error('Database error');
    }

    if (!data || data.length === 0) {
      throw new Error('Invalid credentials or account locked');
    }

    const user = data[0];
    sessionStorage.setItem('user', JSON.stringify(user));
    return user as User;
  },

  register: async (data: RegisterData): Promise<User> => {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', data.email);

    if (existing && existing.length > 0) {
      throw new Error('Email already exists');
    }

    // Create new user
    const newUser = {
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      role: 'candidate',
      is_locked: false,
      created_at: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('users')
      .insert([newUser])
      .select();

    if (error) {
      console.error('Register error:', error);
      throw new Error('Registration failed');
    }

    if (!created || created.length === 0) {
      throw new Error('Registration failed');
    }

    sessionStorage.setItem('user', JSON.stringify(created[0]));
    return created[0] as User;
  },

  logout: (): void => {
    sessionStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const { data: updated, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Update error:', error);
      throw new Error('Failed to update profile');
    }

    if (!updated || updated.length === 0) {
      throw new Error('Failed to update profile');
    }

    sessionStorage.setItem('user', JSON.stringify(updated[0]));
    return updated[0] as User;
  },
};