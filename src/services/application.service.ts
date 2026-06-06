import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { Application } from '../types';
import { notificationService } from './notification.service';

export const applicationService = {
  getAll: (): Application[] => {
    return storage.get<Application[]>(storage.getKeys().APPLICATIONS) || [];
  },

  getByUser: (userId: string): Application[] => {
    const applications = applicationService.getAll();
    return applications.filter(a => a.userId === userId);
  },

  getById: (id: string): Application | null => {
    const applications = applicationService.getAll();
    return applications.find(a => a.id === id) || null;
  },

  create: (data: Omit<Application, 'id' | 'status' | 'submissionDate' | 'updatedAt'>): Application => {
    const applications = applicationService.getAll();
    const newApplication: Application = {
      ...data,
      id: generateId(),
      status: 'pending',
      submissionDate: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
    };
    
    applications.push(newApplication);
    storage.set(storage.getKeys().APPLICATIONS, applications);
    
    notificationService.create({
      userId: data.userId,
      title: 'Application Submitted',
      message: 'Your application has been submitted successfully and is pending review.',
      type: 'success',
    });
    
    return newApplication;
  },

  updateStatus: (id: string, status: Application['status'], userId: string): Application => {
    const applications = applicationService.getAll();
    const index = applications.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    applications[index] = {
      ...applications[index],
      status,
      updatedAt: getCurrentDateTime(),
    };
    
    storage.set(storage.getKeys().APPLICATIONS, applications);
    
    const statusMessage = status === 'approved' ? 'approved' : 'rejected';
    notificationService.create({
      userId,
      title: `Application ${status}`,
      message: `Your application has been ${statusMessage}. ${status === 'approved' ? 'Congratulations!' : 'Please contact support for more information.'}`,
      type: status === 'approved' ? 'success' : 'error',
    });
    
    return applications[index];
  },

  getStats: (): { total: number; pending: number; approved: number; rejected: number } => {
    const applications = applicationService.getAll();
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  },
};