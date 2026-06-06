import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { University } from '../types';

export const universityService = {
  getAll: (): University[] => {
    return storage.get<University[]>(storage.getKeys().UNIVERSITIES) || [];
  },

  getById: (id: string): University | null => {
    const universities = universityService.getAll();
    return universities.find(u => u.id === id) || null;
  },

  create: (data: Omit<University, 'id' | 'createdAt'>): University => {
    const universities = universityService.getAll();
    const newUniversity: University = {
      ...data,
      id: generateId(),
      createdAt: getCurrentDateTime(),
    };
    
    universities.push(newUniversity);
    storage.set(storage.getKeys().UNIVERSITIES, universities);
    return newUniversity;
  },

  update: (id: string, data: Partial<University>): University => {
    const universities = universityService.getAll();
    const index = universities.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('University not found');
    }
    
    universities[index] = { ...universities[index], ...data };
    storage.set(storage.getKeys().UNIVERSITIES, universities);
    return universities[index];
  },

  delete: (id: string): void => {
    const universities = universityService.getAll();
    const filtered = universities.filter(u => u.id !== id);
    storage.set(storage.getKeys().UNIVERSITIES, filtered);
  },
};