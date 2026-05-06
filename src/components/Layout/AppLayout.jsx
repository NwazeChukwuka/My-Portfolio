/**
 * AppLayout Component
 * Encapsulates the main application layout structure
 */
import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAppStore } from '../../stores/useAppStore';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import SkipNavigation from '../Accessibility/SkipNavigation';
import { NotificationSystem } from '../UI/NotificationSystem';
import { LoadingOverlay } from '../UI/LoadingOverlay';

export function AppLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Use Zustand store for sidebar state
  const {
    isSidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapse,
    setMobile,
  } = useAppStore();

  // Update mobile state in store when viewport changes
  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen) {
        const sidebarElement = document.querySelector('.sidebar');
        if (sidebarElement && !sidebarElement.contains(event.target)) {
          closeSidebar();
        }
      }
    };

    if (isMobile && isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, isSidebarOpen, closeSidebar]);

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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close sidebar with Escape key
      if (event.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
      
      // Toggle theme with Ctrl/Cmd + Shift + T
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar, toggleTheme]);

  return (
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
        {/* Header - shows hamburger on mobile, hidden on desktop */}
        <Header
          isMobile={isMobile}
          onMenuClick={toggleSidebar}
          currentTheme={theme}
          onThemeToggle={toggleTheme}
        />

        {/* Main content */}
        <main className="main-content" role="main" id="main-content" tabIndex="-1">
          <SkipNavigation />
          <div className="content-wrapper">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
      
      {/* Global Notification System */}
      <NotificationSystem />
      
      {/* Global Loading Overlay */}
      <LoadingOverlay />
    </div>
  );
}
