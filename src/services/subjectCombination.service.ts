import { supabase } from '../utils/supabase';
import { SubjectCombination } from '../types';

export const subjectCombinationService = {
  getAll: async (): Promise<SubjectCombination[]> => {
    const { data, error } = await supabase
      .from('subject_combinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch subject combinations');
    return data as SubjectCombination[];
  },

  getByMajor: async (majorId: string): Promise<SubjectCombination[]> => {
    const { data, error } = await supabase
      .from('subject_combinations')
      .select('*')
      .eq('major_id', majorId)
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch subject combinations');
    return data as SubjectCombination[];
  },

  getById: async (id: string): Promise<SubjectCombination | null> => {
    const { data, error } = await supabase
      .from('subject_combinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as SubjectCombination;
  },

  create: async (data: Omit<SubjectCombination, 'id' | 'createdAt'>): Promise<SubjectCombination> => {
    const { data: newCombination, error } = await supabase
      .from('subject_combinations')
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error('Failed to create subject combination');
    return newCombination as SubjectCombination;
  },

  update: async (id: string, data: Partial<SubjectCombination>): Promise<SubjectCombination> => {
    const { data: updatedCombination, error } = await supabase
      .from('subject_combinations')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update subject combination');
    return updatedCombination as SubjectCombination;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('subject_combinations')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete subject combination');
  },
};