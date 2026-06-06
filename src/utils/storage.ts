const STORAGE_KEYS = {
  USERS: 'admission_users',
  UNIVERSITIES: 'admission_universities',
  MAJORS: 'admission_majors',
  SUBJECT_COMBINATIONS: 'admission_subject_combinations',
  APPLICATIONS: 'admission_applications',
  NOTIFICATIONS: 'admission_notifications',
  AUTH: 'admission_auth',
};

export const storage = {
  get: <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
  getKeys: () => STORAGE_KEYS,
};

// Helper functions
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};