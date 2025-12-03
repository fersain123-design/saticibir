import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api.ts';

interface User {
  id: string;
  email: string;
  full_name?: string;
  store_name?: string;
  role: string;
  status?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      const responseData = response.data.data || response.data;
      const vendorData = responseData.vendor || responseData;
      
      // Convert vendor data to user format
      const userData: User = {
        id: vendorData.id,
        email: vendorData.email,
        full_name: vendorData.owner_name || vendorData.store_name,
        store_name: vendorData.store_name,
        role: 'vendor',
        status: vendorData.status,
        ...vendorData
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    
    // Handle response format: { success: true, data: { access_token, vendor } }
    const responseData = response.data.data || response.data;
    const { access_token, vendor } = responseData;
    
    if (!access_token || !vendor) {
      throw new Error('Geçersiz yanıt formatı');
    }
    
    // Check if vendor is approved
    if (vendor.status !== 'approved') {
      throw new Error('Hesabınız henüz onaylanmamış. Lütfen onay sürecinin tamamlanmasını bekleyin.');
    }
    
    // Convert vendor to user format
    const userData: User = {
      id: vendor.id,
      email: vendor.email,
      full_name: vendor.owner_name || vendor.store_name,
      store_name: vendor.store_name,
      role: 'vendor',
      status: vendor.status,
      ...vendor
    };
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
