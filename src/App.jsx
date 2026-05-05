// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { logger } from './lib/logger';

// Import global CSS styles
import './styles/colors.css';

// Import Layout Components
import ErrorBoundary from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { AppLayout } from './components/Layout/AppLayout';

import { PortfolioContentProvider } from './hooks/usePortfolioContent';
import { AppRoutes } from './components/Routing';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Import custom hooks
import { useScrollToTop } from './hooks/useScrollToTop';
import { useMediaQuery } from './hooks/useMediaQuery';

/**
 * Main App Component
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
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

  return (
    <Router>
      <PortfolioContentProvider>
        <ScrollToTop />
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </PortfolioContentProvider>
    </Router>
  );
}

export default App;