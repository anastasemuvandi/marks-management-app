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
  classId?: string;
  class?: Class;
  marks?: Mark[];
  modules?: CourseModule[];
}

export interface Mark {
  id: string;
  score: number;
  maxScore: number;
  studentId: string;
  moduleId: string;
  semesterId: string;
  student?: Student;
  module?: CourseModule;
  semester?: Semester;
}

export interface GradeSummary {
  student: Student;
  totalScore: number;
  totalMax: number;
  percentage: number;
  grade: string;
  moduleCount: number;
  marks: Mark[];
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  semesters?: Semester[];
}

export interface Semester {
  id: string;
  name: string;
  number: number;
  startDate: string;
  endDate: string;
  academicYearId: string;
  academicYear?: AcademicYear;
}

export interface CourseModule {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  level?: string;
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
  create: (data: Partial<Student>) => api.post<Student>('/students', data).then(r => r.data),
  update: (id: string, data: Partial<Student>) => api.put<Student>(`/students/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/students/${id}`).then(r => r.data),
  getModules: (id: string) => api.get<CourseModule[]>(`/students/${id}/modules`).then(r => r.data),
  enrollModule: (studentId: string, moduleId: string) => api.post(`/students/${studentId}/modules/${moduleId}`).then(r => r.data),
  unenrollModule: (studentId: string, moduleId: string) => api.delete(`/students/${studentId}/modules/${moduleId}`).then(r => r.data),
};

export const marksApi = {
  getAll: () => api.get<Mark[]>('/marks').then(r => r.data),
  getSummary: () => api.get<GradeSummary[]>('/marks/summary').then(r => r.data),
  getByStudent: (studentId: string) => api.get<Mark[]>(`/marks/student/${studentId}`).then(r => r.data),
  create: (data: Partial<Mark>) => api.post<Mark>('/marks', data).then(r => r.data),
  update: (id: string, data: Partial<Mark>) => api.put<Mark>(`/marks/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/marks/${id}`).then(r => r.data),
};

export const academicYearsApi = {
  getAll: () => api.get<AcademicYear[]>('/academic-years').then(r => r.data),
  create: (data: Partial<AcademicYear>) => api.post<AcademicYear>('/academic-years', data).then(r => r.data),
  update: (id: string, data: Partial<AcademicYear>) => api.patch<AcademicYear>(`/academic-years/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/academic-years/${id}`).then(r => r.data),
};

export const semestersApi = {
  getAll: () => api.get<Semester[]>('/semesters').then(r => r.data),
  getByYear: (academicYearId: string) => api.get<Semester[]>(`/semesters?academicYearId=${academicYearId}`).then(r => r.data),
  create: (data: Partial<Semester>) => api.post<Semester>('/semesters', data).then(r => r.data),
  update: (id: string, data: Partial<Semester>) => api.patch<Semester>(`/semesters/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/semesters/${id}`).then(r => r.data),
};

export const modulesApi = {
  getAll: () => api.get<CourseModule[]>('/modules').then(r => r.data),
  create: (data: Partial<CourseModule>) => api.post<CourseModule>('/modules', data).then(r => r.data),
  update: (id: string, data: Partial<CourseModule>) => api.patch<CourseModule>(`/modules/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/modules/${id}`).then(r => r.data),
};

export const classesApi = {
  getAll: () => api.get<Class[]>('/classes').then(r => r.data),
  create: (data: Partial<Class>) => api.post<Class>('/classes', data).then(r => r.data),
  update: (id: string, data: Partial<Class>) => api.patch<Class>(`/classes/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/classes/${id}`).then(r => r.data),
};

export const reportsApi = {
  downloadExcel: () => {
    const token = localStorage.getItem('auth_token');
    fetch('http://localhost:3001/reports/excel', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'marks-report.xlsx';
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
