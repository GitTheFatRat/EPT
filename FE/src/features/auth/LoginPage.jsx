import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from './authSlice';
import axiosClient from '../../lib/axiosClient';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post('/auth/login', form);
      const authData = res.data.data;
      dispatch(setAuth({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: authData.user
      }));
      navigate('/exams');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[500px] bg-[#111827] text-white p-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EPT</h1>
          <p className="text-gray-400 text-sm mt-1">Practice Platform</p>
        </div>
        
        <div className="mb-20">
          <h2 className="text-3xl font-semibold leading-tight mb-8">
            "The more you practice, the luckier you get."
          </h2>
          <p className="text-gray-400 text-sm mb-16">
            Join 12,000+ students preparing for EPT.
          </p>
          
          <div className="flex gap-10">
            <div>
              <div className="text-2xl font-bold">12k+</div>
              <div className="text-gray-400 text-xs mt-1">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-gray-400 text-xs mt-1">Band improvement</div>
            </div>
            <div>
              <div className="text-2xl font-bold">400+</div>
              <div className="text-gray-400 text-xs mt-1">Practice tests</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 relative">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  PASSWORD
                </label>
                <button type="button" disabled className="text-indigo-600 text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111827] text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 mt-6"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className="h-px bg-gray-200 flex-1"></span>
            <span className="text-gray-400 text-xs uppercase tracking-wider">or</span>
            <span className="h-px bg-gray-200 flex-1"></span>
          </div>

          <div className="mt-8 space-y-3">
            <button
              disabled
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Continue with Google
            </button>
            <button
              disabled
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
