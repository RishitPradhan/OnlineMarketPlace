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
import { TestAuth } from './components/auth/TestAuth';
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
import CardPaymentPage from './components/payments/CardPaymentPage';
import ChoosePaymentOptionPage from './components/payments/ChoosePaymentOptionPage';
import PaymentSuccessPage from './components/payments/PaymentSuccessPage';
import UPIPaymentPage from './components/payments/UPIPaymentPage';
import OrderDetailsPage from './components/pages/OrderDetailsPage';
import MyOrdersPageApp from './app/orders/my-orders/page';

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
          <Route path="/browse-services" element={<BrowseServicesPage />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/services/edit/:id" element={<EditServicePage />} />
        </Route>
        
        {/* Standalone Messages Route - No MainLayout */}
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/orders/my-orders" element={<MyOrdersPageApp />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/dummy-freelancer/:id" element={<DummyFreelancerProfile />} />
        <Route path="/featured-project" element={<FeaturedProject />} />
        <Route path="/test-auth" element={<TestAuth />} />
        <Route path="/payment" element={<ChoosePaymentOptionPage onSelect={() => {}} />} />
        <Route path="/payment/card" element={<CardPaymentPage />} />
        <Route path="/payment/options" element={<ChoosePaymentOptionPage onSelect={() => {}} />} />
        <Route path="/payments/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/upi" element={<UPIPaymentPage />} />
      </Routes>
    </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;