import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../lib/axiosClient';
import Sidebar from '../../components/ui/Sidebar';
import { setAuth } from '../auth/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const user = useSelector(state => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form info
  const [formData, setFormData] = useState({
    description: '',
    targetBand: 6.5,
    studyType: 'academic'
  });

  // Image Upload States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [bannerUploading, setBannerUploading] = useState(false);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/auth/me');
        const userData = res.data.data;
        
        dispatch(setAuth({
          accessToken,
          refreshToken,
          user: userData
        }));

        setFormData({
          description: userData.description || '',
          targetBand: userData.targetBand || 6.5,
          studyType: userData.studyType || 'academic'
        });
        
        setAvatarPreview(userData.avatarUrl || '');
        setBannerPreview(userData.bannerUrl || '');
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setErrorMsg('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [accessToken, dispatch, navigate, refreshToken]);

  const validateFile = (file) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh (jpg, png, webp).';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'Dung lượng file không được vượt quá 5MB.';
    }
    return null;
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      setSuccessMsg('');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      setSuccessMsg('');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setErrorMsg('');
    setSuccessMsg('');
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', avatarFile);
      const res = await axiosClient.post('/users/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrl = res.data.data.url;
      dispatch(setAuth({ accessToken, refreshToken, user: { ...user, avatarUrl: newUrl } }));
      setAvatarFile(null);
      setSuccessMsg('Đã cập nhật Avatar thành công.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Lỗi khi upload avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return;
    setErrorMsg('');
    setSuccessMsg('');
    setBannerUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', bannerFile);
      const res = await axiosClient.post('/users/me/banner', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrl = res.data.data.url;
      dispatch(setAuth({ accessToken, refreshToken, user: { ...user, bannerUrl: newUrl } }));
      setBannerFile(null);
      setSuccessMsg('Đã cập nhật Banner thành công.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Lỗi khi upload banner.');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'targetBand') {
      finalValue = parseFloat(value);
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    
    const payload = {};
    if (formData.description !== undefined) payload.description = formData.description;
    if (formData.targetBand) payload.targetBand = formData.targetBand;
    if (formData.studyType) payload.studyType = formData.studyType;

    try {
      setSaving(true);
      const res = await axiosClient.patch('/users/me', payload);
      
      const updatedUser = res.data.data;
      dispatch(setAuth({
        accessToken,
        refreshToken,
        user: updatedUser
      }));
      
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      console.error('Failed to update profile', err);
      setErrorMsg(err.response?.data?.error?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc] font-sans">
        <Sidebar username={user?.fullName || user?.username} targetBand={user?.targetBand} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      <Sidebar username={user?.fullName || user?.username} targetBand={user?.targetBand} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences.</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              {successMsg}
            </div>
          )}
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Images</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Banner</label>
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-sm">Chưa có banner</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="text-white font-medium">Đổi ảnh Banner</span>
                  </div>
                  <input type="file" ref={bannerInputRef} onChange={handleBannerSelect} accept="image/jpeg,image/png,image/webp"  />
                </div>
                {bannerFile && (
                  <div className="mt-3 flex items-center space-x-3">
                    <span className="text-sm text-gray-600 truncate">{bannerFile.name}</span>
                    <button 
                      onClick={handleUploadBanner} 
                      disabled={bannerUploading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {bannerUploading ? 'Đang tải...' : 'Lưu ảnh'}
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Avatar</label>
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 group shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200 font-bold text-2xl">
                        {(user?.fullName || user?.username)?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span className="text-white text-xs font-medium text-center px-2">Đổi ảnh</span>
                    </div>
                    <input type="file" ref={avatarInputRef} onChange={handleAvatarSelect} accept="image/jpeg,image/png,image/webp"  />
                  </div>
                  
                  {avatarFile && (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-gray-600 truncate max-w-xs">{avatarFile.name}</span>
                      <button 
                        onClick={handleUploadAvatar} 
                        disabled={avatarUploading}
                        className="w-min whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {avatarUploading ? 'Đang tải...' : 'Lưu ảnh'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#111827] focus:border-[#111827] outline-none transition-colors text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Band</label>
                  <select
                    name="targetBand"
                    value={formData.targetBand}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#111827] focus:border-[#111827] outline-none transition-colors text-sm bg-white"
                  >
                    {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(band => (
                      <option key={band} value={band}>{band.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Study Type</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="studyType"
                        value="academic"
                        checked={formData.studyType === 'academic'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#111827] border-gray-300 focus:ring-[#111827]"
                      />
                      <span className="text-sm text-gray-700 font-medium">Academic</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="studyType"
                        value="general_training"
                        checked={formData.studyType === 'general_training'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#111827] border-gray-300 focus:ring-[#111827]"
                      />
                      <span className="text-sm text-gray-700 font-medium">General</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#111827] hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

