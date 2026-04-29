// src/components/UI/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css'; // Specific styles for the Button component

/**
 * Button Component
 * A highly reusable and flexible button component for your portfolio.
 * It can render as a standard <button> or a <Link> from react-router-dom.
 * Supports different styles (primary, secondary) and onClick events.
 *
 * @param {object} props - Component props.
 * @param {string} props.children - The text or content displayed inside the button.
 * @param {string} [props.to] - If provided, the button will render as a React Router Link to this path.
 * @param {function} [props.onClick] - Function to call when the button is clicked.
 * @param {string} [props.type='button'] - HTML button type ('button', 'submit', 'reset'). Only applies if 'to' is not provided.
 * @param {string} [props.variant='primary'] - Visual style of the button ('primary' or 'secondary').
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled.
 * @param {string} [props.target] - For external links, e.g., "_blank". Only applies if 'to' is a full URL.
 * @param {string} [props.rel] - For external links, e.g., "noopener noreferrer".
 */
const Button = ({
  children,
  to,
  href,
  onClick,
  type = 'button', // Default HTML button type
  variant = 'primary', // Default visual variant
  className = '', // Additional classes for customization
  disabled = false,
  target,
  rel,
  ...otherProps // Captures any other standard HTML attributes
}) => {
  const baseClass = `btn ${variant}-btn ${className}`; // Combine base, variant, and custom classes
  const destination = to || href;

  if (destination) {
    // If 'to' prop is provided, render as a React Router Link
    const isExternal = destination.startsWith('http://') || destination.startsWith('https://');

    if (isExternal) {
      // Render as a standard anchor tag for external links
      return (
        <a
          href={destination}
          className={baseClass}
          onClick={onClick}
          target={target || '_blank'} // Default to _blank for external links
          rel={rel || 'noopener noreferrer'} // Recommended for security with _blank
          disabled={disabled} // Disabled attribute for anchor tags is not standard, but can be managed with CSS
          {...otherProps}
        >
          {children}
        </a>
      );
    } else {
      // Render as a React Router Link for internal navigation
      return (
        <Link
          to={destination}
          className={baseClass}
          onClick={onClick}
          disabled={disabled} // Link elements do not have a disabled attribute, CSS handles visual
          {...otherProps}
        >
          {children}
        </Link>
      );
    }
  }

  // If no 'to' prop, render as a standard HTML button
  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;