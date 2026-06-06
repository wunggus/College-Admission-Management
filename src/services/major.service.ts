import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { Major } from '../types';

export const majorService = {
  getAll: (): Major[] => {
    return storage.get<Major[]>(storage.getKeys().MAJORS) || [];
  },

  getByUniversity: (universityId: string): Major[] => {
    const majors = majorService.getAll();
    return majors.filter(m => m.universityId === universityId);
  },

  getById: (id: string): Major | null => {
    const majors = majorService.getAll();
    return majors.find(m => m.id === id) || null;
  },

  create: (data: Omit<Major, 'id' | 'createdAt'>): Major => {
    const majors = majorService.getAll();
    const newMajor: Major = {
      ...data,
      id: generateId(),
      createdAt: getCurrentDateTime(),
    };
    
    majors.push(newMajor);
    storage.set(storage.getKeys().MAJORS, majors);
    return newMajor;
  },

  update: (id: string, data: Partial<Major>): Major => {
    const majors = majorService.getAll();
    const index = majors.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error('Major not found');
    }
    
    majors[index] = { ...majors[index], ...data };
    storage.set(storage.getKeys().MAJORS, majors);
    return majors[index];
  },

  delete: (id: string): void => {
    const majors = majorService.getAll();
    const filtered = majors.filter(m => m.id !== id);
    storage.set(storage.getKeys().MAJORS, filtered);
  },
};