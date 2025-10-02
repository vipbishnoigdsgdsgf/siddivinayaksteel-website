
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { Loader } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
// Basic SEO - keeping it simple
const GlobalSEO = () => (
  <></>
);

// Dynamic imports for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const RegisterMeeting = lazy(() => import('./pages/RegisterMeeting'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutDeveloper = lazy(() => import('./pages/AboutDeveloper'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const SearchResults = lazy(() => import('./pages/SearchResults')); // Fixed import
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const EmailConfirmationPage = lazy(() => import('./pages/EmailConfirmation'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-dark-100">
    <div className="flex flex-col items-center gap-4">
      <Loader className="h-12 w-12 animate-spin text-steel" />
      <p className="text-steel font-medium">Loading...</p>
    </div>
  </div>
);

// Error boundary component to prevent blank screens
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Router error boundary caught error:", error);
    return <Navigate to="/" replace />;
  }
};

function App() {
return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <GlobalSEO />
          <Toaster position="top-center" richColors />
          <Analytics />
          <Suspense fallback={<LoadingFallback />}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/sys-admin-dashboard-x7k9m2p8q" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:id" element={<ProjectPage />} />
              <Route path="/register-meeting" element={<RegisterMeeting />} />
              <Route path="/register-meeting/:projectId" element={<RegisterMeeting />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about-developer" element={<AboutDeveloper />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="/search" element={<SearchResults />} /> {/* Fixed route */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/project/:id" element={<ProjectPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
