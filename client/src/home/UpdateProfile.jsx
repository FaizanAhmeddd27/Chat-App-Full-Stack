import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: null,
  });
  const [preview, setPreview] = useState(user?.avatar?.url || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const response = await axios.post('/api/user/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      
      setIsModalOpen(false);
      setFormData({ name: response.data.user.name, avatar: null });
      setPreview(response.data.user.avatar.url);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-full transition-all duration-300 group"
        title="Update Profile"
      >
        <div className="avatar relative">
          <div className="w-8 sm:w-10 rounded-full ring ring-cyan-500 ring-offset-gray-900 ring-offset-2 transition-all duration-300 group-hover:ring-cyan-400 group-hover:scale-105">
            <img src={user?.avatar?.url} alt="profile" className="object-cover" />
          </div>
        </div>
        <span className="text-xs text-white font-medium">Update Profile</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all duration-300 mx-auto my-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 mb-4 text-center">
              Update Profile
            </h2>
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="avatar relative">
                  <div className="w-20 sm:w-24 md:w-28 lg:w-32 rounded-full ring ring-cyan-500 ring-offset-gray-900 ring-offset-2">
                    <img src={preview} alt="profile preview" className="object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered input-primary w-full bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 py-2 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn btn-primary bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-md hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 py-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="flex-1 btn btn-ghost text-gray-400 rounded-xl hover:bg-gray-700 transition-all duration-300 py-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;