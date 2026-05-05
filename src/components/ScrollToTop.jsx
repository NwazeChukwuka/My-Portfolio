/**
 * ScrollToTop Component
 * Ensures page scrolls to top on route changes
 */
import { useScrollToTop } from '../hooks/useScrollToTop';

export function ScrollToTop() {
  useScrollToTop();
  return null;
}
