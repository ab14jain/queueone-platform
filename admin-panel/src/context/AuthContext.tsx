import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: 'doctor' | 'staff') => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        authApi.setAuthHeader(storedToken);
        const response = await authApi.getCurrentUser(storedToken);
        if (response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          authApi.clearAuthHeader();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      authApi.clearAuthHeader();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: 'doctor' | 'staff'): Promise<boolean> => {
    try {
      const response =
        userType === 'doctor'
          ? await authApi.doctorLogin(email, password)
          : await authApi.staffLogin(email, password);

      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        authApi.setAuthHeader(response.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    authApi.clearAuthHeader();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
