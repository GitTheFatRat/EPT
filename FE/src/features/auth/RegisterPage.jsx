import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from './authSlice';
import axiosClient from '../../lib/axiosClient';
import { generateUsernameFromFullName } from '../../lib/utils';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [studyType, setStudyType] = useState('academic');
  const [targetBand, setTargetBand] = useState('6.5');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const username = generateUsernameFromFullName(form.fullName);
      await axiosClient.post('/auth/register', {
        username,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      const loginRes = await axiosClient.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      dispatch(setAuth({
        accessToken: loginRes.data.data.accessToken,
        refreshToken: loginRes.data.data.refreshToken,
        user: loginRes.data.data.user
      }));

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.patch('/users/me', {
        studyType,
        targetBand: parseFloat(targetBand)
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      navigate('/exams');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Update failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/exams');
  };

  const bandOptions = [];
  for (let i = 1.0; i <= 9.0; i += 0.5) {
    bandOptions.push(i.toFixed(1));
  }

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[500px] bg-[#111827] text-white p-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EPT</h1>
          <p className="text-gray-400 text-sm mt-1">Practice Platform</p>
        </div>

        <div className="mb-20 space-y-10">
          <div className="flex gap-5 items-start">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
              1
            </div>
            <div>
              <div className={`font-semibold ${step === 1 ? 'text-white' : 'text-gray-400'}`}>Create your account</div>
              <div className="text-gray-500 text-sm mt-1">Name, email and password</div>
            </div>
          </div>
          <div className="flex gap-5 items-start">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
              2
            </div>
            <div>
              <div className={`font-semibold ${step === 2 ? 'text-white' : 'text-gray-400'}`}>Set your exam goal</div>
              <div className="text-gray-500 text-sm mt-1">Type, target band and date</div>
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          Join 12,000+ students preparing for EPT.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 relative">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <>
              <div className="mb-8">
                <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mb-2 block">Step 1 of 2</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                  />
                </div>

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
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
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
                  {loading ? 'Creating account...' : 'Continue'}
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
                  Sign up with Google
                </button>
                <button
                  disabled
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Sign up with Facebook
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mb-2 block">Step 2 of 2</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Set your exam goal</h2>
                <p className="text-gray-500 text-sm">
                  Tell us about your goal to get personalized recommendations.
                </p>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    STUDY TYPE
                  </label>
                  <select
                    value={studyType}
                    onChange={(e) => setStudyType(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="general_training">General Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    TARGET BAND
                  </label>
                  <select
                    value={targetBand}
                    onChange={(e) => setTargetBand(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                  >
                    {bandOptions.map(band => (
                      <option key={band} value={band}>{band}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#111827] text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : 'Complete setup'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={loading}
                    className="w-full text-gray-500 hover:text-gray-800 text-sm font-medium transition"
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
