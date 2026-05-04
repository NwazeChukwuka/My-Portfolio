// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaCaretDown } from 'react-icons/fa'; // Import icons for menu and dropdown
import usePortfolioContent from '../../hooks/usePortfolioContent';

import './Navbar.css';

// The Navbar component now accepts 'toggleSidebar' as a prop
const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { general = {} } = usePortfolioContent();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // When the menu icon is clicked (which is typically for mobile),
    // we also want to toggle the actual sidebar visibility.
    toggleSidebar();
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false); // Also close dropdown when main menu closes
    // No need to call toggleSidebar here directly, as it handles closing itself
    // when a link inside it is clicked, or via the overlay.
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close menu and dropdown when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          {general.fullName || 'Your Name'}
        </Link>

        {/* This is the menu icon (hamburger/X) that toggles both the internal Navbar state
            and the external Sidebar component visibility via toggleSidebar prop */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* The 'nav-menu' below is typically for desktop, and might hide on mobile
            in favor of the Sidebar. If you intended this to be your mobile menu,
            you'd want to also call toggleSidebar when these links are clicked.
            However, our current setup suggests the Sidebar is the mobile menu.
            So, we keep this as is, for desktop only. */}
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/" className="nav-links" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li className="nav-item dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <span className="nav-links dropdown-toggle" onClick={toggleDropdown}>
              Roles <FaCaretDown />
            </span>
            <ul className={isDropdownOpen ? 'dropdown-menu active' : 'dropdown-menu'}>
              <li className="dropdown-item">
                <NavLink to="/web-developer" className="dropdown-links" onClick={closeMenu}>
                  Web Developer
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/data-analyst" className="dropdown-links" onClick={closeMenu}>
                  Data Analyst
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/portfolio" className="nav-links" onClick={closeMenu}>
              Portfolio
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink to="/blog" className="nav-links" onClick={closeMenu}>
              Blog
            </NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink to="/resources" className="nav-links" onClick={closeMenu}>
              Resources
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/faq" className="nav-links" onClick={closeMenu}>
              FAQs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-links" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;