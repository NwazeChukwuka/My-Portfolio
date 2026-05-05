/**
 * Skip Navigation Component
 * Provides skip links for keyboard navigation accessibility
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SkipNavigation.css';

/**
 * SkipNavigation Component
 * Adds skip-to-content and skip-to-navigation links for accessibility
 */
const SkipNavigation = () => {
  const [isFocused, setIsFocused] = useState(false);
  const location = useLocation();

  // Focus management for skip links
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show skip links when tab is pressed
      if (event.key === 'Tab') {
        setIsFocused(true);
      }
    };

    const handleMouseDown = () => {
      // Hide skip links when mouse is used
      setIsFocused(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Skip to main content
  const skipToMain = (e) => {
    e.preventDefault();
    const mainContent = document.querySelector('main, [role="main"], .main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Skip to navigation
  const skipToNav = (e) => {
    e.preventDefault();
    const navigation = document.querySelector('nav[role="navigation"], .sidebar, header nav');
    if (navigation) {
      const firstFocusable = navigation.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        navigation.focus();
      }
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Skip to contact form (if on contact page)
  const skipToContact = (e) => {
    e.preventDefault();
    const contactForm = document.querySelector('#contact-form, .contact-form, form[action*="contact"]');
    if (contactForm) {
      const firstInput = contactForm.querySelector('input, textarea');
      if (firstInput) {
        firstInput.focus();
      } else {
        contactForm.focus();
      }
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`skip-navigation ${isFocused ? 'focused' : ''}`}
      role="navigation"
      aria-label="Skip navigation links"
    >
      <a
        href="#main-content"
        onClick={skipToMain}
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <a
        href="#navigation"
        onClick={skipToNav}
        className="skip-link"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
      
      {location.pathname === '/contact' && (
        <a
          href="#contact-form"
          onClick={skipToContact}
          className="skip-link"
          aria-label="Skip to contact form"
        >
          Skip to contact form
        </a>
      )}
    </div>
  );
};

export default SkipNavigation;
