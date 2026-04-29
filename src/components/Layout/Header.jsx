// src/components/Layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import personalData from '../../data/personalData';
import './Header.css';

/**
 * Header Component
 * Simple header that only shows on mobile with hamburger menu
 * On desktop, this is hidden as sidebar handles all navigation
 */
const Header = ({ isMobile, onMenuClick, currentTheme, onThemeToggle }) => {
  const { general } = personalData;

  // Don't render header on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Mobile menu button */}
        <button
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          aria-expanded="false"
        >
          <FaBars />
        </button>

        {/* Logo/Brand */}
        <Link 
          to="/" 
          className="header-logo"
          onClick={() => {
            // Close mobile menu when logo is clicked
            if (isMobile) {
              // This will be handled by the sidebar close logic
            }
          }}
        >
          {general.fullName || 'Your Name'}
        </Link>

        {/* Theme toggle for mobile */}
        <button
          className="theme-toggle-mobile"
          onClick={onThemeToggle}
          aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;