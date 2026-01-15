import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface User {
  idDueño: number;
  nombres_Dueño: string;
  apellidos_Dueño: string;
  cedula_Dueño: string;
  celular_Dueño: string;
  correo_electronico_Dueño: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


interface AuthProviderProps {
  children: ReactNode;
}

import { useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
      } catch (error) {
        // User is not authenticated, keep user as null
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => {
    try {
      const newUser = await authAPI.register(userData);
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};