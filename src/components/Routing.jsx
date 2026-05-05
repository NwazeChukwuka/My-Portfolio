/**
 * Routing Component
 * Contains all the application routes
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

// Import Page Components
import Home from '../pages/Home';
import WebDeveloper from '../pages/WebDeveloper';
import DataAnalyst from '../pages/DataAnalyst';
import Portfolio from '../pages/Portfolio';
import Resources from '../pages/Resources';
import Faq from '../pages/Faq';
import Contact from '../pages/Contact';
import Blog from '../pages/Blog';
import BlogArticleDetail from '../pages/BlogArticleDetail';
import About from '../pages/About';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import AdminDashboard from '../pages/AdminDashboard';
import NotFoundPage from '../pages/NotFoundPage';
import CaseStudy from '../pages/CaseStudy';
import ServiceDetail from '../pages/ServiceDetail';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
      <Route path="/web-developer" element={<ErrorBoundary><WebDeveloper /></ErrorBoundary>} />
      <Route path="/data-analyst" element={<ErrorBoundary><DataAnalyst /></ErrorBoundary>} />
      <Route path="/portfolio" element={<ErrorBoundary><Portfolio /></ErrorBoundary>} />
      <Route path="/blog" element={<ErrorBoundary><Blog /></ErrorBoundary>} />
      <Route path="/blog/:slug" element={<ErrorBoundary><BlogArticleDetail /></ErrorBoundary>} />
      <Route path="/resources" element={<ErrorBoundary><Resources /></ErrorBoundary>} />
      <Route path="/faq" element={<ErrorBoundary><Faq /></ErrorBoundary>} />
      <Route path="/contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
      <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
      <Route path="/privacy" element={<ErrorBoundary><Privacy /></ErrorBoundary>} />
      <Route path="/terms" element={<ErrorBoundary><Terms /></ErrorBoundary>} />
      <Route path="/admin/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
      <Route path="/admin/reset-password" element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
      <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
      <Route path="/case-studies/:slug" element={<ErrorBoundary><CaseStudy /></ErrorBoundary>} />
      <Route path="/services/:slug" element={<ErrorBoundary><ServiceDetail /></ErrorBoundary>} />
      <Route path="/accountant" element={<Navigate to="/not-found" replace />} />
      <Route path="/research-academic" element={<Navigate to="/not-found" replace />} />
      <Route path="/not-found" element={<ErrorBoundary><NotFoundPage /></ErrorBoundary>} />
      <Route path="*" element={<ErrorBoundary><NotFoundPage /></ErrorBoundary>} />
    </Routes>
  );
}
