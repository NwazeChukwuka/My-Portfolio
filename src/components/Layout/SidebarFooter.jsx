/**
 * Sidebar Footer Component
 * Displays theme toggle and close button in the sidebar
 */
import React from 'react';
import { FaSun, FaMoon, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Sidebar.css';

export function SidebarFooter({ 
  isCollapsed, 
  isMobile, 
  currentTheme, 
  onThemeToggle, 
  onClose, 
  onToggleCollapse 
}) {
  return (
    <div className="sidebar-footer">
      {/* Theme toggle */}
      <button
        className={`theme-toggle ${isCollapsed ? 'icon-only' : ''}`}
        onClick={onThemeToggle}
        aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {currentTheme === 'dark' ? (
          <FaSun />
        ) : (
          <FaMoon />
        )}
        {!isCollapsed && (
          <span>
            {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </button>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      )}

      {/* Close button (mobile only) */}
      {isMobile && (
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
          title="Close navigation menu"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
