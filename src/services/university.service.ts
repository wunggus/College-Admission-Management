import { supabase } from '../utils/supabase';
import { University } from '../types';

export const universityService = {
  getAll: async (): Promise<University[]> => {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch universities');
    return data as University[];
  },

  getById: async (id: string): Promise<University | null> => {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as University;
  },

  create: async (data: Omit<University, 'id' | 'createdAt'>): Promise<University> => {
    const { data: newUniversity, error } = await supabase
      .from('universities')
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error('Failed to create university');
    return newUniversity as University;
  },

  update: async (id: string, data: Partial<University>): Promise<University> => {
    const { data: updatedUniversity, error } = await supabase
      .from('universities')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update university');
    return updatedUniversity as University;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('universities')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete university');
  },
};