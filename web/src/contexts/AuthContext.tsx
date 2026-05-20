'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      document.cookie = `auth_token=${storedToken}; path=/; max-age=${7 * 24 * 3600}`;
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post('http://localhost:3001/auth/login', { username, password });
    const { access_token, user: u } = res.data;
    setToken(access_token);
    setUser(u);
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('auth_user', JSON.stringify(u));
    document.cookie = `auth_token=${access_token}; path=/; max-age=${7 * 24 * 3600}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin', loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
