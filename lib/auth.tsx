'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'vault@2024';

type AuthCtx = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({ isLoggedIn: false, login: () => false, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('vault_auth') === 'true');
    setChecked(true);
  }, []);

  const login = (username: string, password: string) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem('vault_auth', 'true');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vault_auth');
    setIsLoggedIn(false);
  };

  if (!checked) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
