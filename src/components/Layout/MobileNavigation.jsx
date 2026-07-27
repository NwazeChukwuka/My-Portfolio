// src/components/Layout/MobileNavigation.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaHome, FaCode, FaChartBar, FaEnvelope,
  FaToolbox, FaQuestionCircle, FaBlog, FaUser,
  FaFolder
} from 'react-icons/fa';

/**
 * Mobile Navigation Component
 * Simplified navigation designed specifically for mobile screens
 * Not a forced desktop sidebar behavior
 */
const MobileNavigation = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Simplified mobile navigation items
  const mobileNavItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: FaHome
    },
    { 
      name: 'Portfolio', 
      path: '/portfolio', 
      icon: FaFolder
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: FaUser
    },
    { 
      name: 'Web Developer', 
      path: '/web-developer', 
      icon: FaCode
    },
    { 
      name: 'Data Analyst', 
      path: '/data-analyst', 
      icon: FaChartBar
    },
    { 
      name: 'Resources', 
      path: '/resources', 
      icon: FaToolbox
    },
    { 
      name: 'FAQ', 
      path: '/faq', 
      icon: FaQuestionCircle
    },
    { 
      name: 'Blog', 
      path: '/blog', 
      icon: FaBlog
    },
    { 
      name: 'Contact', 
      path: '/contact', 
      icon: FaEnvelope
    },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={`mobile-navigation ${isOpen ? 'open' : ''}`}>
      <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
        <ul className="mobile-nav-list">
          {mobileNavItems.map((item) => (
            <li key={item.path} className="mobile-nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={handleLinkClick}
              >
                <item.icon className="mobile-nav-icon" />
                <span className="mobile-nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileNavigation;
