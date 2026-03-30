import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jan-justice-bancked.onrender.com/api';
const API_BASE_URL = 'http://localhost:5001/api';

const API = API_BASE_URL;

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jj_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem('jj_token');
      if (!stored) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setToken(stored);
        } else {
          localStorage.removeItem('jj_token');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('jj_token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('jj_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('jj_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('jj_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
