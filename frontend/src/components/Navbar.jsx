import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { getMonthName } from '../utils/dateFormatter';

const Navbar = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const now = new Date();
  const currentMonthStr = `${getMonthName(now.getMonth() + 1)} ${now.getFullYear()}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Left Section: Mobile Menu Toggle & Month Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Month Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentMonthStr}</span>
          </div>
        </div>

        {/* Middle Section: Search Field */}
        <div className="flex-1 max-w-xs mx-4 hidden md:block">
          <div
            onClick={() => navigate('/transactions')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/60 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search transactions by description...</span>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 z-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notifications</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800">Welcome to FinTrack!</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Track your expenses and monthly budget easily.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded-2xl transition-colors"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'User'}
                </span>
                <span className="block text-[10px] text-slate-500 leading-tight truncate max-w-[100px]">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
