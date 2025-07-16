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
import {
  MyGigsPage,
  MyOrdersPage,
  ActiveOrdersPage,
  AnalyticsPage,
  ReviewsPage,
  EarningsPage,
  PaymentsPage,
  UsersPage,
  GigsPage,
  SettingsPage,
  MessagesPage,
  NotificationsPage
} from './components/pages';
import MainLayout from './components/layout/MainLayout';

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
        {/* MainLayout-wrapped routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/my-gigs" element={<MyGigsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/active-orders" element={<ActiveOrdersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/onboarding" element={<OnboardingHubPage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/profile-completion" element={<ProfileCompletionPage />} />
          <Route path="/quick-start" element={<QuickStartPage />} />
        </Route>
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/service/:id" element={<ServiceFreelancers />} />
        <Route path="/featured-project" element={<FeaturedProject />} />
        <Route path="/test-auth" element={<TestAuth />} />
      </Routes>
    </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;