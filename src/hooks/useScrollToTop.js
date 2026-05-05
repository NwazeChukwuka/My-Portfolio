/**
 * useScrollToTop Hook
 * Ensures page scrolls to top on route changes
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to reduce route transition delay perception
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
