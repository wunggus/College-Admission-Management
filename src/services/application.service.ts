import { supabase } from '../utils/supabase';
import { Application } from '../types';
import { notificationService } from './notification.service';

export const applicationService = {
  getAll: async (): Promise<Application[]> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('submission_date', { ascending: false });

    if (error) throw new Error('Failed to fetch applications');
    return data as Application[];
  },

  getByUser: async (userId: string): Promise<Application[]> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('submission_date', { ascending: false });

    if (error) throw new Error('Failed to fetch applications');
    return data as Application[];
  },

  getById: async (id: string): Promise<Application | null> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Application;
  },

  create: async (data: {
    user_id: string;
    university_id: string;
    major_id: string;
    subject_combination_id: string;
    exam_score: number;
    priority_category: string;
    notes: string;
    transcript_file?: string;
    id_card_file?: string;
  }): Promise<Application> => {
    const newApplication = {
      user_id: data.user_id,
      university_id: data.university_id,
      major_id: data.major_id,
      subject_combination_id: data.subject_combination_id,
      exam_score: data.exam_score,
      priority_category: data.priority_category,
      notes: data.notes,
      transcript_file: data.transcript_file,
      id_card_file: data.id_card_file,
      status: 'pending',
      submission_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: createdApp, error } = await supabase
      .from('applications')
      .insert([newApplication])
      .select()
      .single();

    if (error) throw new Error('Failed to submit application');

    // Create notification
    await notificationService.create({
      user_id: data.user_id,
      title: 'Application Submitted',
      message: 'Your application has been submitted successfully and is pending review.',
      type: 'success',
    });

    return createdApp as Application;
  },

  updateStatus: async (id: string, status: Application['status'], userId: string): Promise<Application> => {
    const { data: updatedApp, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update application status');

    const statusMessage = status === 'approved' ? 'approved' : 'rejected';
    await notificationService.create({
      user_id: userId,
      title: `Application ${status}`,
      message: `Your application has been ${statusMessage}. ${status === 'approved' ? 'Congratulations!' : 'Please contact support for more information.'}`,
      type: status === 'approved' ? 'success' : 'error',
    });

    return updatedApp as Application;
  },

  getStats: async (): Promise<{ total: number; pending: number; approved: number; rejected: number }> => {
    const { data, error } = await supabase
      .from('applications')
      .select('status');

    if (error) throw new Error('Failed to fetch stats');

    const total = data.length;
    const pending = data.filter(a => a.status === 'pending').length;
    const approved = data.filter(a => a.status === 'approved').length;
    const rejected = data.filter(a => a.status === 'rejected').length;

    return { total, pending, approved, rejected };
  },
};