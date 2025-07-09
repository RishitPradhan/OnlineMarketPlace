import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { HomePage } from './components/home/HomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FreelancerProfile } from './components/dashboard/FreelancerProfile';
import { ServiceFreelancers } from './components/dashboard/ServiceFreelancers';
import { FeaturedProject } from './components/dashboard/FeaturedProject';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
    <Router>
      <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/service/:id" element={<ServiceFreelancers />} />
        <Route path="/featured-project" element={<FeaturedProject />} />
      </Routes>
    </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;