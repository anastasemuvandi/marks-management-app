import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      document.cookie = 'auth_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export interface Student {
  id: string;
  name: string;
  studentId: string;
  group?: string;
  marks?: Mark[];
}

export interface Mark {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  studentId: string;
  student?: Student;
}

export interface GradeSummary {
  student: Student;
  totalScore: number;
  totalMax: number;
  percentage: number;
  grade: string;
  subjectCount: number;
  marks: Mark[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher';
  isActive: boolean;
  createdAt: string;
}

export const studentsApi = {
  getAll: () => api.get<Student[]>('/students').then(r => r.data),
  getOne: (id: string) => api.get<Student>(`/students/${id}`).then(r => r.data),
  create: (data: Omit<Student, 'id'>) => api.post<Student>('/students', data).then(r => r.data),
  update: (id: string, data: Partial<Student>) => api.put<Student>(`/students/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/students/${id}`).then(r => r.data),
};

export const marksApi = {
  getAll: () => api.get<Mark[]>('/marks').then(r => r.data),
  getSummary: () => api.get<GradeSummary[]>('/marks/summary').then(r => r.data),
  getByStudent: (studentId: string) => api.get<Mark[]>(`/marks/student/${studentId}`).then(r => r.data),
  create: (data: Omit<Mark, 'id'>) => api.post<Mark>('/marks', data).then(r => r.data),
  update: (id: string, data: Partial<Mark>) => api.put<Mark>(`/marks/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/marks/${id}`).then(r => r.data),
};

export const reportsApi = {
  downloadExcel: () => {
    const token = localStorage.getItem('auth_token');
    const url = `http://localhost:3001/reports/excel`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'marks-report.xlsx');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        a.href = URL.createObjectURL(blob);
        a.click();
      });
  },
};

export const usersApi = {
  getAll: () => api.get<User[]>('/users').then(r => r.data),
  getOne: (id: string) => api.get<User>(`/users/${id}`).then(r => r.data),
  create: (data: Partial<User> & { password: string }) => api.post<User>('/users', data).then(r => r.data),
  update: (id: string, data: Partial<User> & { password?: string }) => api.patch<User>(`/users/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
};
