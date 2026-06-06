import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const users = storage.get<User[]>(storage.getKeys().USERS) || [];
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password && !u.isLocked
    );
    
    if (!user) {
      throw new Error('Invalid credentials or account locked');
    }
    
    storage.set(storage.getKeys().AUTH, user);
    return user;
  },

  register: async (data: RegisterData): Promise<User> => {
    const users = storage.get<User[]>(storage.getKeys().USERS) || [];
    
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: generateId(),
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: 'candidate',
      isLocked: false,
      createdAt: getCurrentDateTime(),
    };
    
    users.push(newUser);
    storage.set(storage.getKeys().USERS, users);
    storage.set(storage.getKeys().AUTH, newUser);
    
    return newUser;
  },

  logout: (): void => {
    storage.remove(storage.getKeys().AUTH);
  },

  getCurrentUser: (): User | null => {
    return storage.get<User>(storage.getKeys().AUTH);
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const users = storage.get<User[]>(storage.getKeys().USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...data };
    storage.set(storage.getKeys().USERS, users);
    
    const currentUser = storage.get<User>(storage.getKeys().AUTH);
    if (currentUser && currentUser.id === userId) {
      storage.set(storage.getKeys().AUTH, users[userIndex]);
    }
    
    return users[userIndex];
  },
};