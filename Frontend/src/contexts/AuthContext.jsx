import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock user data
const MOCK_USER = {
  id: 'usr_001',
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '+91 98765 43210',
  avatar: null,
  farms: [
    { id: 'farm_001', name: 'Kumar Fields', location: 'Nashik, Maharashtra', acres: 12.5 },
    { id: 'farm_002', name: 'North Plot', location: 'Nashik, Maharashtra', acres: 6.0 },
  ],
  activeFarm: 'farm_001',
  language: 'en',
  plan: 'pro',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Persist mock auth in sessionStorage so page refresh keeps you logged in
    const stored = sessionStorage.getItem('agrix_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((credentials) => {
    // Mock login — in production, call your API here
    const loggedIn = { ...MOCK_USER, ...credentials };
    setUser(loggedIn);
    sessionStorage.setItem('agrix_user', JSON.stringify(loggedIn));
    return Promise.resolve(loggedIn);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('agrix_user');
  }, []);

  const switchFarm = useCallback((farmId) => {
    setUser(prev => {
      const updated = { ...prev, activeFarm: farmId };
      sessionStorage.setItem('agrix_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const activeFarm = user?.farms?.find(f => f.id === user.activeFarm) || user?.farms?.[0];

  return (
    <AuthContext.Provider value={{ user, login, logout, switchFarm, activeFarm, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
