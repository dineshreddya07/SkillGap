import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signupUser as apiSignup,
  loginUser as apiLogin,
  fetchCurrentUser,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  // Initialize and verify user on mount or token change
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const stored = getStoredToken();
      if (!stored) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetchCurrentUser();
        if (isMounted && res && res.success && res.data?.user) {
          setUser(res.data.user);
          setToken(stored);
        } else {
          logout();
        }
      } catch {
        // Token invalid or expired
        if (isMounted) logout();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for global auth expiration events from Axios interceptor
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('skillgap:auth-expired', handleAuthExpired);
    return () => {
      isMounted = false;
      window.removeEventListener('skillgap:auth-expired', handleAuthExpired);
    };
  }, [logout]);

  // Login action
  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res && res.success && res.data) {
      const { user: authedUser, token: authToken } = res.data;
      setStoredToken(authToken);
      setToken(authToken);
      setUser(authedUser);
      return res.data;
    }
    throw new Error(res?.message || 'Login failed.');
  };

  // Signup action
  const signup = async (name, email, password) => {
    const res = await apiSignup({ name, email, password });
    if (res && res.success && res.data) {
      const { user: authedUser, token: authToken } = res.data;
      setStoredToken(authToken);
      setToken(authToken);
      setUser(authedUser);
      return res.data;
    }
    throw new Error(res?.message || 'Registration failed.');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
