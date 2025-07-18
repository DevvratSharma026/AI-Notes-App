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
        const res = await fetch('http://localhost:4000/api/v1/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          dispatch(setUser(data.user));
        } else {
          setIsAuthenticated(false);
          dispatch(clearUser());
        }
      } catch {
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