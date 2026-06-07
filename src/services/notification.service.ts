import { supabase } from '../utils/supabase';
import { Notification } from '../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch notifications');
    return data as Notification[];
  },

  getByUser: async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch notifications');
    return data as Notification[];
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: false })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) return 0;
    return data?.length || 0;
  },

  create: async (data: { user_id: string; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }): Promise<Notification> => {
    const newNotification = {
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const { data: createdNotification, error } = await supabase
      .from('notifications')
      .insert([newNotification])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create notification');
    }
    return createdNotification as Notification;
  },

  markAsRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw new Error('Failed to mark notification as read');
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) throw new Error('Failed to mark all notifications as read');
  },
};