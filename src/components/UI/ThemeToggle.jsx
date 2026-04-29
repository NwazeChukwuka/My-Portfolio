// src/components/UI/ThemeToggle.jsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Icons for sun and moon
import './ThemeToggle.css'; // Specific styles for the theme toggle button

/**
 * ThemeToggle component.
 * Provides a button to switch between 'dark' and 'light' themes.
 * The current theme is passed as a prop, and a function to toggle it.
 *
 * @param {object} props - Component props.
 * @param {string} props.currentTheme - The currently active theme ('dark' or 'light').
 * @param {function} props.toggleTheme - Function to call when the button is clicked to change the theme.
 */
const ThemeToggle = ({ currentTheme, toggleTheme }) => {
  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      // ARIA label for accessibility, indicating what the button does
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Conditionally render sun or moon icon based on current theme */}
      {currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;