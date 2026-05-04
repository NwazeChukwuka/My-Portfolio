// src/App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import global CSS styles
import './styles/colors.css';

// Import Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Import Page Components
import Home from './pages/Home';
import WebDeveloper from './pages/WebDeveloper';
import DataAnalyst from './pages/DataAnalyst';
import Portfolio from './pages/Portfolio';
import Resources from './pages/Resources';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogArticleDetail from './pages/BlogArticleDetail';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import AdminSetup from './pages/AdminSetup';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import CaseStudy from './pages/CaseStudy';
import ServiceDetail from './pages/ServiceDetail';
import { PortfolioContentProvider } from './hooks/usePortfolioContent';

/**
 * ScrollToTop Component
 * Ensures page scrolls to top on route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to reduce route transition delay perception
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

/**
 * useLocalStorage Hook
 * Custom hook for localStorage with SSR safety
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * useMediaQuery Hook
 * Custom hook for responsive breakpoints
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Main App Component
 */
function App() {
  // Theme management with localStorage persistence
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  
  // Sidebar state management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Also apply to body for consistent theming
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 30,
      delay: 0,
      anchorPlacement: 'top-bottom',
    });

    // Refresh AOS on route changes
    return () => AOS.refresh();
  }, []);

  // Close sidebar on mobile when clicking outside or on route change
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsSidebarOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile, isSidebarOpen]);

  // Handler functions
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    if (!isMobile) {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close sidebar with Escape key
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
      
      // Toggle theme with Ctrl/Cmd + Shift + T
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, toggleTheme]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <Router>
      <PortfolioContentProvider>
        <ScrollToTop />
        <div className={`app ${theme}`} data-sidebar-collapsed={sidebarCollapsed}>
        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          />
        )}

        {/* Sidebar - always present, hidden on mobile by default */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onClose={closeSidebar}
          onToggleCollapse={toggleSidebarCollapse}
          currentTheme={theme}
          onThemeToggle={toggleTheme}
        />

        {/* Main layout */}
        <div 
          className={`main-layout ${isSidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        >
          {/* Header - only shows hamburger on mobile, hidden on desktop */}
          <Header
            isMobile={isMobile}
            onMenuClick={toggleSidebar}
            currentTheme={theme}
            onThemeToggle={toggleTheme}
          />

          {/* Main content */}
          <main className="main-content" role="main">
            <div className="content-wrapper">
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
                <Route path="/admin/setup" element={<ErrorBoundary><AdminSetup /></ErrorBoundary>} />
                <Route path="/admin/reset-password" element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
                <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="/case-studies/:slug" element={<ErrorBoundary><CaseStudy /></ErrorBoundary>} />
                <Route path="/services/:slug" element={<ErrorBoundary><ServiceDetail /></ErrorBoundary>} />
                <Route path="/accountant" element={<Navigate to="/not-found" replace />} />
                <Route path="/research-academic" element={<Navigate to="/not-found" replace />} />
                <Route path="/not-found" element={<ErrorBoundary><NotFoundPage /></ErrorBoundary>} />
                <Route path="*" element={<ErrorBoundary><NotFoundPage /></ErrorBoundary>} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
        </div>
      </PortfolioContentProvider>
    </Router>
  );
}

export default App;