import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getUser, checkAuth, login as loginService, register as registerService, logout as logoutService, User } from '../services/authService';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'guest-user', username: 'Guest' },
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // In guest mode, we always have a user
  const [user, setUser] = useState<User>(getUser());
  const [isLoading, setIsLoading] = useState(false);

  // Simplified useEffect that just sets the guest user
  useEffect(() => {
    const initAuth = async () => {
      const guestUser = getUser();
      setUser(guestUser);
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Simplified login - no credentials needed in guest mode
  const login = async () => {
    setIsLoading(true);
    try {
      const response = await loginService();
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified register - no credentials needed in guest mode
  const register = async () => {
    setIsLoading(true);
    try {
      const response = await registerService();
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  // No-op logout
  const logout = () => {
    logoutService();
    // In guest mode, we always stay as the guest user
    setUser(getUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true, // Always authenticated in guest mode
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 