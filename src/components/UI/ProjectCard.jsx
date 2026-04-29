// src/components/UI/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaCode } from 'react-icons/fa'; // Icons for external link and code
import './ProjectCard.css'; // Specific styles for the ProjectCard

/**
 * ProjectCard Component
 * Displays a single project with an image, title, category, and optional links
 * for live demo and source code.
 *
 * @param {object} props - Component props.
 * @param {string} props.image - Path to the project image.
 * @param {string} props.title - Title of the project.
 * @param {string} props.category - Category the project belongs to (e.g., 'Web Development', 'Data Analysis').
 * @param {string} [props.description] - A short description/snippet of the project.
 * @param {string} [props.liveLink] - URL for the live demo of the project (optional).
 * @param {string} [props.codeLink] - URL for the source code repository (optional).
 * @param {string} [props.detailsLink] - Internal path to a detailed project page (optional).
 * @param {string} [props.aos='fade-up'] - AOS animation type for the card.
 * @param {number} [props.aosDelay=0] - Delay for AOS animation in milliseconds.
 */
const ProjectCard = ({
  image,
  title,
  category,
  description,
  liveLink,
  codeLink,
  detailsLink,
  aos = 'fade-up',
  aosDelay = 0,
}) => {
  const isExternalDetailsLink = detailsLink?.startsWith('http');

  return (
    <div className="project-card card" data-aos={aos} data-aos-delay={aosDelay}>
      <div className="project-image-wrapper">
        <img src={image} alt={title} className="project-image" loading="lazy" decoding="async" />
      </div>
      <div className="project-content">
        <span className="project-category">{category}</span>
        <h3 className="project-title">{title}</h3>
        {description && <p className="project-description">{description}</p>}
        <div className="project-links">
          {liveLink && (
            <a href={liveLink} target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`View live demo of ${title}`}>
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
          {codeLink && (
            <a href={codeLink} target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`View source code for ${title}`}>
              <FaCode /> Code
            </a>
          )}
          {detailsLink && (
            isExternalDetailsLink ? (
              <a
                href={detailsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link details-link"
                aria-label={`View details for ${title}`}
              >
                View Details &rarr;
              </a>
            ) : (
              // Using Link from react-router-dom for internal details page
              <Link to={detailsLink} className="project-link details-link" aria-label={`View details for ${title}`}>
                View Details &rarr;
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;