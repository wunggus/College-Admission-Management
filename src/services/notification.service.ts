import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { Notification } from '../types';

export const notificationService = {
  getAll: (): Notification[] => {
    return storage.get<Notification[]>(storage.getKeys().NOTIFICATIONS) || [];
  },

  getByUser: (userId: string): Notification[] => {
    const notifications = notificationService.getAll();
    return notifications.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getUnreadCount: (userId: string): number => {
    const notifications = notificationService.getByUser(userId);
    return notifications.filter(n => !n.isRead).length;
  },

  create: (data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification => {
    const notifications = notificationService.getAll();
    const newNotification: Notification = {
      ...data,
      id: generateId(),
      isRead: false,
      createdAt: getCurrentDateTime(),
    };
    
    notifications.push(newNotification);
    storage.set(storage.getKeys().NOTIFICATIONS, notifications);
    return newNotification;
  },

  markAsRead: (id: string): void => {
    const notifications = notificationService.getAll();
    const index = notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      notifications[index].isRead = true;
      storage.set(storage.getKeys().NOTIFICATIONS, notifications);
    }
  },

  markAllAsRead: (userId: string): void => {
    const notifications = notificationService.getAll();
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    storage.set(storage.getKeys().NOTIFICATIONS, notifications);
  },
};