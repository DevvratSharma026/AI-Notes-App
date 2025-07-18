import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/pasteSlice';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('API URL:', apiUrl);
        
        if (!apiUrl) {
          console.error('VITE_API_URL is not defined');
          setIsAuthenticated(false);
          dispatch(clearUser());
          return;
        }

        // Get token from localStorage as fallback
        const token = localStorage.getItem('token');
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers
        });
        
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          dispatch(setUser(data.user));
        } else {
          setIsAuthenticated(false);
          dispatch(clearUser());
          // Clear invalid token
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        dispatch(clearUser());
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div className="text-center py-10 text-gray-300">Checking authentication...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute; 
