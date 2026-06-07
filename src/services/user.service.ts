import { supabase } from '../utils/supabase';
import { User } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch users');
    return data as User[];
  },

  getCandidates: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'candidate')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch candidates');
    return data as User[];
  },

  lockAccount: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .update({ is_locked: true })
      .eq('id', userId);

    if (error) throw new Error('Failed to lock account');
  },

  unlockAccount: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .update({ is_locked: false })
      .eq('id', userId);

    if (error) throw new Error('Failed to unlock account');
  },

  resetPassword: async (userId: string, newPassword: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', userId);

    if (error) throw new Error('Failed to reset password');
  },
};