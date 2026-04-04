import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
       delete axios.defaults.headers.common['Authorization'];
       setUser(null);
       localStorage.removeItem('user');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/auth/login', { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/auth/signup', { name, email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
