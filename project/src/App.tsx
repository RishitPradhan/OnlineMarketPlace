import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { HomePage } from './components/home/HomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { FreelancerProfile } from './components/dashboard/FreelancerProfile';
import { ServiceFreelancers } from './components/dashboard/ServiceFreelancers';
import { FeaturedProject } from './components/dashboard/FeaturedProject';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { useAuth } from './contexts/AuthContext';
import { LoadingScreen } from './components/ui/LoadingScreen';
import GettingStartedPage from './components/onboarding/GettingStartedPage';
import ProfileCompletionPage from './components/onboarding/ProfileCompletionPage';
import QuickStartPage from './components/onboarding/QuickStartPage';
import OnboardingHubPage from './components/onboarding/OnboardingHubPage';
import ProfilePage from './components/pages/ProfilePage';
import ServicesPage from './components/pages/ServicesPage';
import PortfolioPage from './components/pages/PortfolioPage';
import SkillsPage from './components/pages/SkillsPage';
import { TestAuth } from './components/auth/TestAuth';

// Component to redirect authenticated users away from auth pages
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Initializing authentication..." />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
    <Router>
      <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={
              <AuthRedirect>
                <LoginForm />
              </AuthRedirect>
            } />
            <Route path="/register" element={
              <AuthRedirect>
                <RegisterForm />
              </AuthRedirect>
            } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/service/:id" element={<ServiceFreelancers />} />
        <Route path="/featured-project" element={<FeaturedProject />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingHubPage />
          </ProtectedRoute>
        } />
        <Route path="/getting-started" element={
          <ProtectedRoute>
            <GettingStartedPage />
          </ProtectedRoute>
        } />
        <Route path="/profile-completion" element={
          <ProtectedRoute>
            <ProfileCompletionPage />
          </ProtectedRoute>
        } />
        <Route path="/quick-start" element={
          <ProtectedRoute>
            <QuickStartPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <ServicesPage />
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <PortfolioPage />
          </ProtectedRoute>
        } />
        <Route path="/skills" element={
          <ProtectedRoute>
            <SkillsPage />
          </ProtectedRoute>
        } />
        <Route path="/test-auth" element={<TestAuth />} />
      </Routes>
    </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;