import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
