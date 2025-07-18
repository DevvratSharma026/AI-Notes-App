import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send/receive cookies
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/'); // Redirect to home or dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-gray-700/50 shadow-2xl transition-all hover:shadow-blue-500/10 hover:border-blue-400/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
  
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
  
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300/80">Email address</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300/80">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all mb-8"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="absolute top-1/3 right-3 -translate-y-1/2 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Log in
            </>
          )}
        </button>
  
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login; 