// src/components/Layout/Sidebar.jsx
import React, { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaHome, FaCode, FaChartBar, FaEnvelope,
  FaToolbox, FaQuestionCircle, FaBlog, FaUser,
  FaLinkedin, FaGithub, FaWhatsapp, FaTimes, FaSun, FaMoon,
  FaChevronLeft, FaChevronRight, FaFolder
} from 'react-icons/fa';
import personalData from '../../data/personalData';
import useSiteSettings from '../../hooks/useSiteSettings';
import './Sidebar.css';

const profilePic = '/assets/profile-placeholder.png';

/**
 * Sidebar Component
 * Main navigation component that serves as:
 * - Permanent sidebar on desktop
 * - Collapsible sidebar on desktop
 * - Slide-out menu on mobile
 */
const Sidebar = ({ 
  isOpen, 
  isCollapsed, 
  isMobile, 
  onClose, 
  onToggleCollapse, 
  currentTheme, 
  onThemeToggle 
}) => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { general: overrideGeneral, contact: overrideContact } = useSiteSettings();
  const { general, contact } = {
    general: overrideGeneral || personalData.general,
    contact: overrideContact || personalData.contact,
  };

  // Navigation items configuration
  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: FaHome,
      description: 'Welcome page'
    },
    { 
      name: 'Portfolio', 
      path: '/portfolio', 
      icon: FaFolder,
      description: 'View my work'
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: FaUser,
      description: 'Career overview'
    },
    { 
      name: 'Web Developer', 
      path: '/web-developer', 
      icon: FaCode,
      description: 'Web development'
    },
    { 
      name: 'Data Analyst', 
      path: '/data-analyst', 
      icon: FaChartBar,
      description: 'Data insights'
    },
    { 
      name: 'Resources', 
      path: '/resources', 
      icon: FaToolbox,
      description: 'Useful tools'
    },
    { 
      name: 'FAQ', 
      path: '/faq', 
      icon: FaQuestionCircle,
      description: 'Common questions'
    },
    { 
      name: 'Blog', 
      path: '/blog', 
      icon: FaBlog,
      description: 'Latest articles'
    },
    { 
      name: 'Contact', 
      path: '/contact', 
      icon: FaEnvelope,
      description: 'Get in touch'
    },
  ];

  // Social links configuration
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: contact.linkedin || '#',
      icon: FaLinkedin,
      color: '#0077b5'
    },
    {
      name: 'GitHub',
      url: contact.github || '#',
      icon: FaGithub,
      color: '#333'
    },
    {
      name: 'WhatsApp',
      url: contact.whatsapp || '#',
      icon: FaWhatsapp,
      color: '#25d366'
    }
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const focusableElement = sidebarRef.current.querySelector('.sidebar-close-btn, .nav-link');
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const renderNavItem = (item) => {
    if (item.isGroup) {
      return (
        <li key={item.name} className="nav-group">
          {!isCollapsed && (
            <div className="nav-group-title">
              <span>{item.name}</span>
            </div>
          )}
          <ul className="nav-group-items">
            {item.items.map((subItem) => (
              <li key={subItem.path} className="nav-item">
                <NavLink
                  to={subItem.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={handleLinkClick}
                  title={isCollapsed ? subItem.name : subItem.description}
                >
                  <subItem.icon className="nav-icon" />
                  {!isCollapsed && (
                    <span className="nav-text">{subItem.name}</span>
                  )}
                  {isCollapsed && (
                    <div className="nav-tooltip">
                      <span>{subItem.name}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.path} className="nav-item">
        <NavLink
          to={item.path}
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
          onClick={handleLinkClick}
          title={isCollapsed ? item.name : item.description}
        >
          <item.icon className="nav-icon" />
          {!isCollapsed && (
            <span className="nav-text">{item.name}</span>
          )}
          {isCollapsed && (
            <div className="nav-tooltip">
              <span>{item.name}</span>
            </div>
          )}
        </NavLink>
      </li>
    );
  };
  const iconOnlyThemeToggle = isCollapsed || isMobile;

  return (
    <>
      <nav 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={isMobile ? !isOpen : false}
      >
        {/* Mobile close button */}
        {isMobile && (
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        )}

        {/* Profile section */}
        <div className="profile-section">
          <div className="profile-avatar">
            <NavLink
              to="/admin/login"
              className="profile-login-link"
              onClick={handleLinkClick}
              aria-label="Open admin login"
              title="Admin login"
            >
              <img 
                src={profilePic} 
                alt={general.fullName || 'Profile'} 
                className="profile-pic" 
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
                }}
              />
            </NavLink>
            {!isCollapsed && (
              <div className="profile-status" title="Available">
                <div className="status-indicator online"></div>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <>
              <h2 className="profile-name">
                {general.fullName || 'Your Name'}
              </h2>
              <p className="profile-title">
                {general.tagline || 'Multidisciplinary Professional'}
              </p>
              
              {/* Social links */}
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={`Visit ${social.name} profile`}
                    style={{ '--social-color': social.color }}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation menu */}
        <div className="nav-section">
          <ul className="nav-menu">
            {navItems.map(renderNavItem)}
          </ul>
        </div>

        {/* Theme toggle and footer */}
        <div className="sidebar-footer">
          <button
            className={`theme-toggle ${iconOnlyThemeToggle ? 'icon-only' : ''}`}
            onClick={onThemeToggle}
            aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
            {!iconOnlyThemeToggle && (
              <span>{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
          
          {!isCollapsed && (
            <div className="sidebar-copyright">
              <p>&copy; {new Date().getFullYear()} {general.fullName || 'Your Name'}</p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;