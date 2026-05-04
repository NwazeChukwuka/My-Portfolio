// src/pages/Portfolio.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import local data
import usePortfolioContent from '../hooks/usePortfolioContent';

// Import UI Components
import ProjectCard from '../components/UI/ProjectCard'; // Re-using for all projects

import './Portfolio.css'; // Page-specific styles for Portfolio

/**
 * Portfolio Page Component
 * Displays a comprehensive collection of all projects across Mazi Chukwuka's
 * diverse professional roles, with filtering capabilities.
 */
const Portfolio = () => {
  const personalData = usePortfolioContent();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // Optional: Scroll to top on page load if not handled by ScrollToTop component in App.jsx
    window.scrollTo(0, 0);
  }, []);

  const allProjects = useMemo(() => {
    const fromDb = personalData.projectsFromDb || [];
    if (fromDb.length) return fromDb;
    return [
      ...(personalData.homePortfolioPreviews || []),
      ...(personalData.webDeveloper?.projects || []),
      ...(personalData.dataAnalyst?.projects || []),
    ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  }, [personalData]);

  // Extract unique categories for filtering
  const categories = useMemo(
    () => ['All', ...new Set(allProjects.map((project) => project.category))],
    [allProjects]
  );

  const [filter, setFilter] = useState('All');
  const filteredProjects = useMemo(
    () => (filter === 'All' ? allProjects : allProjects.filter((project) => project.category === filter)),
    [filter, allProjects]
  );

  useEffect(() => {
    AOS.refreshHard();
  }, [filter]);

  return (
    <div className="portfolio-page">
      {/* --- Page Hero/Banner Section --- */}
      <section className="portfolio-hero-section">
        <div className="portfolio-hero-content" data-aos="fade-up">
          <h1 className="page-title">My Diverse Portfolio</h1>
          <p className="page-subtitle">Showcasing a Spectrum of Professional Work & Projects</p>
        </div>
      </section>

      {/* --- Filter Section --- */}
      <section className="portfolio-filter-section common-section">
        <div className="filter-buttons" data-aos="fade-up">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`filter-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- Projects Grid Section --- */}
      <section className="portfolio-projects-grid common-section">
        {filteredProjects.length > 0 ? (
          <div className="projects-grid-container">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index} // Use project ID if available, otherwise index
                image={project.image}
                title={project.title}
                category={project.category}
                description={project.description}
                detailsLink={project.detailsLink}
                isInternalLink={project.isInternalLink || false} // Default to false if not specified
                aos="fade-up"
                aosDelay={index % 3 * 100} // Stagger animation for grid
              />
            ))}
          </div>
        ) : (
          <p className="no-projects-message" data-aos="fade-up">
            {allProjects.length === 0
              ? 'No projects published yet. Add projects in Admin.'
              : 'No projects found for this category.'}
          </p>
        )}
      </section>
    </div>
  );
};

export default Portfolio;