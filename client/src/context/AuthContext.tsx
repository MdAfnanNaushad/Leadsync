import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUser } from '../types/shared.types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSessionResolving: boolean;
  loginSession: (token: string, profile: IUser) => void;
  logoutSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSessionResolving, setIsSessionResolving] = useState<boolean>(true);

  useEffect(() => {
    // Resolve existing tracking parameters inside storage maps upon browser startup
    const savedToken = localStorage.getItem('leadsync_jwt_token');
    const savedProfile = localStorage.getItem('leadsync_user_profile');

    if (savedToken && savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setToken(savedToken);
        setUser(parsedProfile);
      } catch (e) {
        // Invalid stored profile, clear it
        localStorage.removeItem('leadsync_user_profile');
        localStorage.removeItem('leadsync_jwt_token');
      }
    }

    setIsSessionResolving(false);
  }, []);

  const loginSession = (newToken: string, profile: IUser) => {
    setToken(newToken);
    setUser(profile);
    localStorage.setItem('leadsync_jwt_token', newToken);
    localStorage.setItem('leadsync_user_profile', JSON.stringify(profile));
  };

  const logoutSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('leadsync_jwt_token');
    localStorage.removeItem('leadsync_user_profile');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isSessionResolving,
      loginSession,
      logoutSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be invoked within an active AuthProvider container node.');
  return context;
};