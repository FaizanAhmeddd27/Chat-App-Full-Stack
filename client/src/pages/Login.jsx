import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      toast.success("Login Successful!");
      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setFormData({ email: "", password: "" });
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center p-4">
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-5 w-full max-w-md border border-slate-700/30 flex flex-col justify-between">
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-xs">Sign in to continue your conversations</p>
        </div>

        <div className="space-y-3">
          <div className="group">
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-slate-700/40 text-sm"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="group">
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-slate-700/40 text-sm"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 hover:from-cyan-600 hover:via-indigo-700 hover:to-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-slate-400 text-xs mb-2">New to BuddyTalk?</p>
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 mb-2 font-medium transition-colors border border-cyan-500/30 px-4 py-1 rounded-lg hover:bg-cyan-500/10 text-sm inline-block"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;