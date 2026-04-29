// src/pages/Resources.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBook, FaTools, FaGraduationCap, FaLink, FaLightbulb, FaArrowRight } from 'react-icons/fa';

// Import local data (assuming you'll add resources data here)
import usePortfolioContent from '../hooks/usePortfolioContent';

import './Resources.css'; // Page-specific styles for Resources

/**
 * Resources Page Component
 * Displays a curated list of valuable resources across different professional domains.
 */
const Resources = () => {
  const personalData = usePortfolioContent();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0); // Ensure scroll to top on page load
  }, []);

  const resources = personalData.resources || [];

  // Helper function to get the appropriate icon
  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'book':
        return <FaBook />;
      case 'tool':
        return <FaTools />;
      case 'course':
        return <FaGraduationCap />;
      case 'article':
      case 'website':
        return <FaLink />;
      default:
        return <FaLightbulb />; // Default icon
    }
  };

  return (
    <div className="resources-page">
      {/* --- Page Hero/Banner Section --- */}
      <section className="resources-hero-section">
        <div className="resources-hero-content" data-aos="fade-up">
          <h1 className="page-title">Valuable Resources</h1>
          <p className="page-subtitle">Curated Tools, Books, & Learning Materials for Growth</p>
        </div>
      </section>

      {/* --- Resources Categories/List --- */}
      <section className="resources-list-section common-section">
        {resources.length > 0 ? (
          <div className="resources-grid-container">
            {resources.map((resource, index) => (
              <div className="resource-card card" key={index} data-aos="fade-up" data-aos-delay={index % 3 * 100}>
                <div className="resource-icon">{getResourceIcon(resource.type)}</div>
                <h3>{resource.title}</h3>
                <p className="resource-category">{resource.category}</p>
                <p className="resource-description">{resource.description}</p>
                {resource.link && (
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                    Explore Resource <FaArrowRight />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-resources-message" data-aos="fade-up">No resources added yet. Check back soon!</p>
        )}
      </section>

      {/* Optional: Call to Action for suggestions */}
      <section className="resources-cta-section common-section" data-aos="fade-up">
        <h2 className="section-title">Have a Resource Suggestion?</h2>
        <p className="section-subtitle">Help me expand this list! Share valuable resources you've found useful.</p>
        <Link to="/contact" className="suggestion-button">Suggest a Resource</Link>
      </section>
    </div>
  );
};

export default Resources;