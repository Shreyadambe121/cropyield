import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('cropwise_token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cropwise_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('cropwise_token', token);
    } else {
      localStorage.removeItem('cropwise_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cropwise_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cropwise_user');
    }
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      setToken,
      setUser,
      logout: () => {
        setToken('');
        setUser(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
