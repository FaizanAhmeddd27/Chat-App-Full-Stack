import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute';
import  { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-black min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
