import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile", {
        withCredentials: true, 
      });
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(" Fetch profile error:", error.response?.data || error.message);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const fetchOtherUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/other-users", {
        withCredentials: true,
      });
      setUsers(data.users);
    } catch (error) {
      toast.error(" Fetch other users error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOtherUsers();
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        setUser, 
        users, 
        loading, 
        isAuthenticated, 
        fetchProfile, 
        fetchOtherUsers 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
