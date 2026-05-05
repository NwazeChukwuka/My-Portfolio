// src/components/Layout/Sidebar.jsx
import React, { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaHome, FaCode, FaChartBar, FaEnvelope,
  FaToolbox, FaQuestionCircle, FaBlog, FaUser,
  FaLinkedin, FaGithub, FaWhatsapp, FaTimes, FaSun, FaMoon,
  FaChevronLeft, FaChevronRight, FaFolder
} from 'react-icons/fa';
import usePortfolioContent from '../../hooks/usePortfolioContent';
import { SidebarProfile } from './SidebarProfile';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarFooter } from './SidebarFooter';
import './Sidebar.css';

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
  const portfolio = usePortfolioContent();
  const general = portfolio.general || {};
  const contact = portfolio.contact || {};
  const profilePic = general.secondaryProfilePicture || '/assets/Me 2.webp';

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

  return (
    <>
      <nav 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={isMobile ? !isOpen : false}
      >
        {/* Profile section */}
        <SidebarProfile
          isCollapsed={isCollapsed}
          general={general}
          contact={contact}
          socialLinks={socialLinks}
          handleLinkClick={handleLinkClick}
        />

        {/* Navigation menu */}
        <SidebarNavigation
          navItems={navItems}
          isCollapsed={isCollapsed}
          handleLinkClick={handleLinkClick}
          renderNavItem={renderNavItem}
        />

        {/* Theme toggle and footer */}
        <SidebarFooter
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          currentTheme={currentTheme}
          onThemeToggle={onThemeToggle}
          onClose={onClose}
          onToggleCollapse={onToggleCollapse}
        />
      </nav>
    </>
  );
};

export default Sidebar;