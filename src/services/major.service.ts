import { supabase } from '../utils/supabase';
import { Major } from '../types';

export const majorService = {
  getAll: async (): Promise<Major[]> => {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch majors');
    return data as Major[];
  },

  getByUniversity: async (universityId: string): Promise<Major[]> => {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .eq('university_id', universityId)
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch majors');
    return data as Major[];
  },

  getById: async (id: string): Promise<Major | null> => {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Major;
  },

  create: async (data: Omit<Major, 'id' | 'createdAt'>): Promise<Major> => {
    const { data: newMajor, error } = await supabase
      .from('majors')
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error('Failed to create major');
    return newMajor as Major;
  },

  update: async (id: string, data: Partial<Major>): Promise<Major> => {
    const { data: updatedMajor, error } = await supabase
      .from('majors')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update major');
    return updatedMajor as Major;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('majors')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete major');
  },
};