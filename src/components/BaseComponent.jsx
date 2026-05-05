/**
 * BaseComponent - A foundation for consistent component patterns
 * Provides common patterns and utilities for all components
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Higher-order component for consistent error boundaries
 */
export function withErrorBoundary(Component, fallback = null) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Common prop types and validation patterns
 */
export const commonPropTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  role: PropTypes.string,
};

/**
 * Default props for common components
 */
export const defaultProps = {
  className: '',
  children: null,
  id: null,
  'aria-label': null,
  'aria-describedby': null,
  role: null,
};

/**
 * Component composition utilities
 */
export const compose = (...components) => (props) => {
  return components.reduceRight((acc, Component) => <Component {...acc} />, props);
};

/**
 * Conditional rendering utilities
 */
export const renderIf = (condition, component) => {
  return condition ? component : null;
};

export const renderUnless = (condition, component) => {
  return !condition ? component : null;
};

/**
 * Class name utilities
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const cnIf = (condition, className) => {
  return condition ? className : '';
};

/**
 * Common component patterns
 */
export const Section = ({ children, className, id, 'aria-label': ariaLabel, role = 'region', ...props }) => (
  <section 
    id={id}
    className={cn('section', className)}
    aria-label={ariaLabel}
    role={role}
    {...props}
  >
    {children}
  </section>
);

export const Container = ({ children, className, size = 'medium', ...props }) => {
  const sizeClass = size ? `container--${size}` : '';
  return (
    <div 
      className={cn('container', sizeClass, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Grid = ({ 
  children, 
  className, 
  cols = 1, 
  gap = 'medium', 
  responsive = true,
  ...props 
}) => {
  const colsClass = `grid--cols-${cols}`;
  const gapClass = `grid--gap-${gap}`;
  const responsiveClass = responsive ? 'grid--responsive' : '';
  
  return (
    <div 
      className={cn('grid', colsClass, gapClass, responsiveClass, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Flex = ({ 
  children, 
  className, 
  direction = 'row', 
  align = 'center', 
  justify = 'flex-start', 
  wrap = 'nowrap',
  gap = 'medium',
  ...props 
}) => {
  const directionClass = `flex--${direction}`;
  const alignClass = `flex--align-${align}`;
  const justifyClass = `flex--justify-${justify}`;
  const wrapClass = `flex--wrap-${wrap}`;
  const gapClass = `flex--gap-${gap}`;
  
  return (
    <div 
      className={cn('flex', directionClass, alignClass, justifyClass, wrapClass, gapClass, className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Loading state wrapper
 */
export const LoadingWrapper = ({ isLoading, children, fallback, className, ...props }) => {
  if (isLoading) {
    return fallback || <div className={cn('loading-wrapper', className)} {...props} />;
  }
  
  return <div className={className} {...props}>{children}</div>;
};

/**
 * Accessible button wrapper
 */
export const AccessibleButton = ({ 
  children, 
  disabled = false, 
  loading = false, 
  className, 
  ...props 
}) => {
  return (
    <button
      className={cn('btn', className, {
        'btn--disabled': disabled,
        'btn--loading': loading,
      })}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner" aria-hidden="true" />
          <span className="btn__text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// PropTypes definitions
Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  'aria-label': PropTypes.string,
  role: PropTypes.string,
};

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
};

Grid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  cols: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 12]),
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  responsive: PropTypes.bool,
};

Flex.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
};

LoadingWrapper.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  fallback: PropTypes.node,
  className: PropTypes.string,
};

AccessibleButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
};

export default {
  withErrorBoundary,
  commonPropTypes,
  defaultProps,
  compose,
  renderIf,
  renderUnless,
  cn,
  cnIf,
  Section,
  Container,
  Grid,
  Flex,
  LoadingWrapper,
  AccessibleButton,
};
