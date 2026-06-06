import { storage, generateId, getCurrentDateTime } from '../utils/storage';
import { University, Major, SubjectCombination, User } from '../types';

export const initializeSampleData = () => {
  const users = storage.get(storage.getKeys().USERS);
  if (!users) {
    // Create default admin
    const defaultAdmin: User = {
      id: generateId(),
      email: 'admin@admission.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin',
      isLocked: false,
      createdAt: getCurrentDateTime(),
    };

    // Sample universities
    const universities: University[] = [
      {
        id: 'univ1',
        name: 'Vietnam National University, Hanoi',
        description: 'Leading research university in Northern Vietnam',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'univ2',
        name: 'Ho Chi Minh City University of Technology',
        description: 'Premier engineering university in Southern Vietnam',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'univ3',
        name: 'University of Economics Ho Chi Minh City',
        description: 'Top economics and business university',
        createdAt: getCurrentDateTime(),
      },
    ];

    // Sample majors
    const majors: Major[] = [
      {
        id: 'major1',
        name: 'Computer Science',
        universityId: 'univ1',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'major2',
        name: 'Information Technology',
        universityId: 'univ1',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'major3',
        name: 'Software Engineering',
        universityId: 'univ2',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'major4',
        name: 'Business Administration',
        universityId: 'univ3',
        createdAt: getCurrentDateTime(),
      },
    ];

    // Sample subject combinations
    const subjectCombinations: SubjectCombination[] = [
      {
        id: 'sub1',
        name: 'Mathematics, Physics, Chemistry',
        code: 'A00',
        majorId: 'major1',
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'sub2',
        name: 'Mathematics, Physics, English',
        code: 'A01',
        majorId: 'major1',
        subjects: ['Mathematics', 'Physics', 'English'],
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'sub3',
        name: 'Mathematics, Literature, English',
        code: 'D01',
        majorId: 'major4',
        subjects: ['Mathematics', 'Literature', 'English'],
        createdAt: getCurrentDateTime(),
      },
    ];

    storage.set(storage.getKeys().USERS, [defaultAdmin]);
    storage.set(storage.getKeys().UNIVERSITIES, universities);
    storage.set(storage.getKeys().MAJORS, majors);
    storage.set(storage.getKeys().SUBJECT_COMBINATIONS, subjectCombinations);
    storage.set(storage.getKeys().APPLICATIONS, []);
    storage.set(storage.getKeys().NOTIFICATIONS, []);
  }
};