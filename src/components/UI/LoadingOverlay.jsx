/**
 * Loading Overlay Component
 * Displays global loading states from the Zustand store
 */
import React from 'react';
import { useLoadingStore } from '../../stores/useAppStore';
import './LoadingOverlay.css';

export function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoadingStore();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner" aria-hidden="true">
          <div className="spinner"></div>
        </div>
        {loadingMessage && (
          <div className="loading-overlay__message">
            {loadingMessage}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Local Loading Component
 * For component-specific loading states
 */
export function LoadingSpinner({ size = 'medium', message = '' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      {message && (
        <div className="loading-spinner__message">
          {message}
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton Loading Component
 * For content placeholders during loading
 */
export function SkeletonLoader({ 
  width = '100%', 
  height = '1rem', 
  variant = 'default',
  className = '' 
}) {
  const baseClass = `skeleton skeleton--${variant} ${className}`.trim();
  
  return (
    <div 
      className={baseClass}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Button Loading State Component
 * For buttons that show loading state
 */
export function ButtonLoading({ size = 'small' }) {
  return (
    <div className={`button-loading button-loading--${size}`} aria-hidden="true">
      <div className="spinner"></div>
    </div>
  );
}
