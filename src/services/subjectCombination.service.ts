import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { SubjectCombination } from '../types';

export const subjectCombinationService = {
  getAll: (): SubjectCombination[] => {
    return storage.get<SubjectCombination[]>(storage.getKeys().SUBJECT_COMBINATIONS) || [];
  },

  getByMajor: (majorId: string): SubjectCombination[] => {
    const combinations = subjectCombinationService.getAll();
    return combinations.filter(c => c.majorId === majorId);
  },

  getById: (id: string): SubjectCombination | null => {
    const combinations = subjectCombinationService.getAll();
    return combinations.find(c => c.id === id) || null;
  },

  create: (data: Omit<SubjectCombination, 'id' | 'createdAt'>): SubjectCombination => {
    const combinations = subjectCombinationService.getAll();
    const newCombination: SubjectCombination = {
      ...data,
      id: generateId(),
      createdAt: getCurrentDateTime(),
    };
    
    combinations.push(newCombination);
    storage.set(storage.getKeys().SUBJECT_COMBINATIONS, combinations);
    return newCombination;
  },

  update: (id: string, data: Partial<SubjectCombination>): SubjectCombination => {
    const combinations = subjectCombinationService.getAll();
    const index = combinations.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Subject combination not found');
    }
    
    combinations[index] = { ...combinations[index], ...data };
    storage.set(storage.getKeys().SUBJECT_COMBINATIONS, combinations);
    return combinations[index];
  },

  delete: (id: string): void => {
    const combinations = subjectCombinationService.getAll();
    const filtered = combinations.filter(c => c.id !== id);
    storage.set(storage.getKeys().SUBJECT_COMBINATIONS, filtered);
  },
};