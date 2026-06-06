import { storage, getCurrentDateTime } from '../utils/storage';
import { User } from '../types';

export const userService = {
  getAll: (): User[] => {
    return storage.get<User[]>(storage.getKeys().USERS) || [];
  },

  getCandidates: (): User[] => {
    const users = userService.getAll();
    return users.filter(u => u.role === 'candidate');
  },

  lockAccount: (userId: string): void => {
    const users = userService.getAll();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index].isLocked = true;
      storage.set(storage.getKeys().USERS, users);
    }
  },

  unlockAccount: (userId: string): void => {
    const users = userService.getAll();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index].isLocked = false;
      storage.set(storage.getKeys().USERS, users);
    }
  },

  resetPassword: (userId: string, newPassword: string): void => {
    const users = userService.getAll();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index].password = newPassword;
      storage.set(storage.getKeys().USERS, users);
    }
  },
};