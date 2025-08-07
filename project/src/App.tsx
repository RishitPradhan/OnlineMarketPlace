import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { HomePage } from './components/home/HomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { FreelancerProfile } from './components/dashboard/FreelancerProfile';
import DummyFreelancerProfile from './components/dashboard/DummyFreelancerProfile';
import { ServiceFreelancers } from './components/dashboard/ServiceFreelancers';
import { FeaturedProject } from './components/dashboard/FeaturedProject';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { useAuth } from './contexts/AuthContext';
import { LoadingScreen } from './components/ui/LoadingScreen';
import ProfilePage from './components/pages/ProfilePage';
import ServicesPage from './components/pages/ServicesPage';
import PortfolioPage from './components/pages/PortfolioPage';
import SkillsPage from './components/pages/SkillsPage';
import {
  MyGigsPage,
  MyOrdersPage,
  MessagesPage,
  NotificationsPage
} from './components/pages';
import MainLayout from './components/layout/MainLayout';
import BrowseServicesPage from './components/pages/BrowseServicesPage';
import ProfileCompletionPage from './components/onboarding/ProfileCompletionPage';
import UserProfile from './components/dashboard/UserProfile';
import EditServicePage from './components/pages/EditServicePage';
import PaymentSuccessPage from './components/payments/PaymentSuccessPage';
import PremiumPaymentPage from './components/payments/PremiumPaymentPage';
import OrderDetailsPage from './components/pages/OrderDetailsPage';
import MyOrdersPageApp from './app/orders/my-orders/page';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import WebDevelopmentService from './components/pages/WebDevelopmentService';
import PaymentsPage from './components/pages/PaymentsPage';

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
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/my-gigs" element={<MyGigsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-completion" element={<ProfileCompletionPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/service" element={<ServiceFreelancers />} />
                        <Route path="/service/:id" element={<ServiceDetailPage />} />
              <Route path="/service/web-development" element={<WebDevelopmentService />} />
              <Route path="/browse-services" element={<BrowseServicesPage />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/services/edit/:id" element={<EditServicePage />} />
        </Route>
        
        {/* Standalone Routes - No MainLayout */}
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/orders/my-orders" element={<MyOrdersPageApp />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/dummy-freelancer/:id" element={<DummyFreelancerProfile />} />
        <Route path="/featured-project" element={<FeaturedProject />} />
        
        {/* Payment Routes - Standalone with ProtectedRoute */}
        <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
        <Route path="/payments/premium" element={<ProtectedRoute><PremiumPaymentPage /></ProtectedRoute>} />
        

        <Route path="/payments/success" element={<PaymentSuccessPage />} />
      </Routes>
    </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;