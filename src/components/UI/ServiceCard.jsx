// src/components/UI/ServiceCard.jsx
import React from 'react';
import './ServiceCard.css'; // Specific styles for the ServiceCard

/**
 * ServiceCard Component
 * Displays an individual service with an icon, title, and description.
 * Designed to be reusable across different professional role pages.
 *
 * @param {object} props - Component props.
 * @param {React.ElementType} props.icon - The icon component (e.g., from react-icons) to display.
 * @param {string} props.title - The title of the service.
 * @param {string} props.description - A brief description of the service.
 * @param {string} [props.aos='fade-up'] - AOS animation type for the card.
 * @param {number} [props.aosDelay=0] - Delay for AOS animation in milliseconds.
 */
const ServiceCard = ({ icon: Icon, title, description, aos = 'fade-up', aosDelay = 0 }) => {
  return (
    <div className="service-card card" data-aos={aos} data-aos-delay={aosDelay}>
      <div className="service-icon-wrapper">
        {/* Render the icon component passed as a prop */}
        {Icon && <Icon className="service-icon" />}
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
    </div>
  );
};

export default ServiceCard;