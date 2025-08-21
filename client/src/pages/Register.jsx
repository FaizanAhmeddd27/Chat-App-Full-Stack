import axios from "axios";
import React, { useState } from "react";
import { User, Mail, Lock, Camera, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = formData.name ? "Name must be at least 2 characters" : "Full Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {  
      newErrors.password = "Password must be at least 5 characters";
    }

    if (!formData.avatar) {
      newErrors.avatar = "Please select a profile picture";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);

      if (formData.avatar) {
        submitData.append("avatar", formData.avatar);
      }

      const response = await axios.post("/api/user/register", submitData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration Successful!");

        setFormData({
          name: '',
          email: '',
          password: '',
          avatar: null
        });
        setAvatarPreview(null);

        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        e.target.value = '';
        return;
      }

      setAvatarPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        avatar: file
      }));

      if (errors.avatar) {
        setErrors((prev) => ({
          ...prev,
          avatar: ''
        }));
      }
    } else {
      setAvatarPreview(null);
      setFormData((prev) => ({
        ...prev,
        avatar: null
      }));
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center p-4">
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-5 w-full max-w-md border border-slate-700/30 flex flex-col justify-between">
        <Link
          to={'/login'}
          className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-4 text-sm"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>

        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent mb-1">
            Join BuddyTalk
          </h1>
          <p className="text-slate-400 text-xs">Create your account and start connecting</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-slate-400 w-6 h-6" />
                  )}
                </div>
              </div>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full p-2 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-110">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
          {errors.avatar && <p className="text-red-500 text-xs mt-1 text-center">{errors.avatar}</p>}

          <div className="group">
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="w-full pl-3 pr-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-slate-700/40 text-sm"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="group">
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full pl-3 pr-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-slate-700/40 text-sm"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="group relative">
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              className="w-full pl-3 pr-9 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-slate-700/40 text-sm"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 transition-colors mt-6"
              tabIndex={-1}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 hover:from-cyan-600 hover:via-indigo-700 hover:to-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;