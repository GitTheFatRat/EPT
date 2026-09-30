import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axiosClient from '../../lib/axiosClient';
import { mockDashboardData } from '../../features/dashboard/mockDashboardData';

export default function Sidebar({ username = 'Student', targetBand = '--' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await axiosClient.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navLinkClass = (path) => {
    // If it's active
    if (location.pathname === path || (path === '/exams' && location.pathname === '/')) {
      return "block px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-medium text-sm";
    }
    return "block px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-md text-sm";
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">EPT</h1>
          <p className="text-gray-400 text-xs">Practice Platform</p>
        </div>
        <nav className="px-4 space-y-1">
          <Link to="/exams" className={navLinkClass('/exams')}>Home</Link>
          <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>Leaderboard</Link>
          <div className="pt-4 pb-2">
            <div className="border-t border-gray-100"></div>
          </div>
          <Link to="/reading" className={navLinkClass('/reading')}>Reading</Link>
          <Link to="/listening" className={navLinkClass('/listening')}>Listening</Link>
          <Link to="/mock-test" className={navLinkClass('/mock-test')}>Mock Test</Link>
        </nav>
      </div>

      <div className="p-4">
        <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">Exam in</p>
          <p className="text-lg font-bold text-gray-900">{mockDashboardData.examDaysLeft} days</p>
          <p className="text-xs text-gray-400">{mockDashboardData.examDate}</p>
        </div>
        <nav className="space-y-1 mb-6">
          <Link to="/settings" className={navLinkClass('/settings')}>Settings</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-md text-sm">Log out</button>
        </nav>
        <div className="flex items-center px-4 pb-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">
              {username.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
            <p className="text-xs text-gray-500">Target: {targetBand}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
