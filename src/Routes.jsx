import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import DailyReadingDashboard from './pages/daily-reading-dashboard';
import GroupManagement from './pages/group-management';
import LandingPage from './pages/landing-page';
import Onboarding from './pages/onboarding';
import ProgressReports from './pages/progress-reports';
import PlanCreationWizard from './pages/plan-creation-wizard';
import Register from './pages/register';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Settings from './pages/settings';
import GroupCreationWizard from './pages/group-creation-wizard';
import About from './pages/about';
import Contact from './pages/contact';

const isNative = Capacitor.isNativePlatform();

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public pages (redirect to dashboard if logged in) */}
        <Route path="/" element={
          <ProtectedRoute publicOnly>
            {isNative ? <Onboarding /> : <LandingPage />}
          </ProtectedRoute>
        } />
        {/* Landing page — web only */}
        {!isNative && (
          <Route path="/landing-page" element={
            <ProtectedRoute publicOnly>
              <LandingPage />
            </ProtectedRoute>
          } />
        )}
        {/* Onboarding — native only (also reachable directly) */}
        {isNative && (
          <Route path="/onboarding" element={
            <ProtectedRoute publicOnly>
              <Onboarding />
            </ProtectedRoute>
          } />
        )}
        <Route path="/register" element={
          <ProtectedRoute publicOnly>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute publicOnly>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute publicOnly>
            <ForgotPassword />
          </ProtectedRoute>
        } />

        {/* Protected pages (require auth) */}
        <Route path="/daily-reading-dashboard" element={
          <ProtectedRoute>
            <DailyReadingDashboard />
          </ProtectedRoute>
        } />
        <Route path="/group-management" element={
          <ProtectedRoute>
            <GroupManagement />
          </ProtectedRoute>
        } />
        <Route path="/progress-reports" element={
          <ProtectedRoute>
            <ProgressReports />
          </ProtectedRoute>
        } />
        <Route path="/plan-creation-wizard" element={
          <ProtectedRoute>
            <PlanCreationWizard />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/group-creation-wizard" element={
          <ProtectedRoute>
            <GroupCreationWizard />
          </ProtectedRoute>
        } />

        {/* Always accessible */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
