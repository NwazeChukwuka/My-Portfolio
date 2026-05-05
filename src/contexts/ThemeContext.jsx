/**
 * Theme Context
 * Provides theme management functionality to the entire application
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { logger } from '../lib/logger';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  // Apply theme to document
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      // Also apply to body for consistent theming
      document.body.className = `theme-${theme}`;
      
      logger.debug(`Theme changed to: ${theme}`);
    } catch (error) {
      logger.warn('Failed to apply theme to document:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    logger.info(`Theme toggled from ${theme} to ${newTheme}`);
  };

  const setThemeValue = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
      logger.info(`Theme set to: ${newTheme}`);
    } else {
      logger.warn('Invalid theme value provided:', newTheme);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
