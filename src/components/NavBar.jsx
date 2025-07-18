import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/pasteSlice';

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(clearUser());
    setDropdownOpen(false);
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="glass-panel-xl backdrop-blur-xl p-4 fixed top-6 left-1/2 -translate-x-1/2 w-[96vw] max-w-4xl z-50 flex items-center justify-between transition-all duration-500 border border-white/10 hover:border-white/20">
      <div className="flex items-center space-x-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 hover:duration-200 group ${
              isActive
                ? 'bg-gradient-to-r from-[#477aac] to-[#12489f] text-white shadow-[0_4px_30px_0_rgba(0,198,251,0.3)] hover:shadow-[0_6px_40px_0_rgba(0,198,251,0.4)]'
                : 'text-gray-200 hover:bg-white/15 hover:text-white hover:shadow-[0_4px_20px_0_rgba(255,255,255,0.05)]'
            }`
          }
        >
          <FiHome className="mr-2 group-hover:scale-110 transition-transform" />
          Home
        </NavLink>

        <NavLink
          to="/pastes"
          className={({ isActive }) =>
            `flex items-center px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 hover:duration-200 group ${
              isActive
                ? 'bg-gradient-to-r from-[#1c93b4] to-[#005bea] text-white shadow-[0_4px_30px_0_rgba(0,198,251,0.3)] hover:shadow-[0_6px_40px_0_rgba(0,198,251,0.4)]'
                : 'text-gray-200 hover:bg-white/15 hover:text-white hover:shadow-[0_4px_20px_0_rgba(255,255,255,0.05)]'
            }`
          }
        >
          <FiFileText className="mr-2 group-hover:scale-110 transition-transform" />
          Notes
        </NavLink>
      </div>

      <div className="relative" ref={dropdownRef}>
        {user ? (
          <>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 rounded-full p-2 bg-white/10 backdrop-blur-lg shadow-lg hover:bg-white/15 hover:shadow-xl transition-all duration-300 hover:scale-105"
              aria-label="Profile menu"
            >
              <div className="relative">
                <FiUser className="h-7 w-7" />
                {dropdownOpen && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-[#00c6fb] to-[#005bea] rounded-full border-2 border-white/50"></span>
                )}
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 glass-panel-xl backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in-up overflow-hidden">
                <div className="p-1">
                  <div className="px-4 py-3 text-sm text-white/80 border-b border-white/5">
                    Welcome, <span className="font-medium text-white">{user.username}</span>
                  </div>
                  <button
                    onClick={() => { navigate('/pastes'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 transition-all font-medium hover:pl-5 flex items-center group"
                  >
                    <FiFileText className="mr-2 group-hover:text-[#00c6fb] transition-colors" />
                    See All Notes
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-all font-medium hover:pl-5 flex items-center group"
                  >
                    <FiLogOut className="mr-2 group-hover:scale-110 transition-transform" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <NavLink 
            to="/login" 
            className="text-gray-200 hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-transparent to-transparent hover:from-[#ff6a00]/10 hover:to-[#ee0979]/10 hover:shadow-[0_4px_20px_0_rgba(238,9,121,0.15)] border border-white/5 hover:border-white/10 flex items-center group"
          >
            <FiLogIn className="mr-2 group-hover:scale-110 transition-transform" />
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default NavBar;