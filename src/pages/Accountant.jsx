// src/pages/Accountant.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import local data
import personalData from '../data/personalData';

// Import UI Components
import Button from '../components/UI/Button';
import ServiceCard from '../components/UI/ServiceCard';
import ProjectCard from '../components/UI/ProjectCard';
import CircularProgressBar from '../components/UI/CircularProgressBar';
import TestimonialCarousel from '../components/UI/TestimonialCarousel'; // Re-use carousel
import AnimatedNumber from '../components/UI/AnimatedNumber'; // For stats section

// Import Icons for call-to-actions
import { FaArrowRight, FaDownload } from 'react-icons/fa';

import './RolePage.css'; // General styles for all role pages
import './Accountant.css'; // Specific overrides/additions for Accountant page

/**
 * Accountant Page Component
 * Displays detailed information about Mazi Chukwuka's services,
 * projects, skills, and experience as a Chartered Accountant.
 */
const Accountant = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // Scroll to section based on hash in URL
    const { hash } = window.location;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a slight delay to allow rendering and AOS initialization
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const accountant = personalData.accountant || {};
  const cvs = personalData.general?.cvs || {};

  // Map existing data model to page model with safe fallbacks.
  const {
    title,
    introduction = [],
    services = [],
    projects = [],
    testimonials = [],
    stats = [],
    skills = [],
    experience = [],
    pricing = null
  } = accountant;
  const pageTitle = title;
  const bio = introduction.join(' ');

  return (
    <div className="role-page accountant-page">
      {/* --- Hero/Banner Section --- */}
      <section className="role-hero-section" id="accountant-home">
        <div className="role-hero-content">
          <div className="role-hero-text" data-aos="fade-right">
            <p className="role-greeting">My Expertise as a</p>
            <h1 className="role-hero-title">{pageTitle}</h1>
            <p className="role-hero-bio">{bio}</p>
            <div className="role-hero-buttons">
              <Button to="/contact" variant="primary">Discuss Your Needs</Button>
              <Button href={cvs.accountant} target="_blank" rel="noopener noreferrer" variant="secondary">
                Download Accountant CV <FaDownload />
              </Button>
            </div>
          </div>
          <div className="role-hero-image" data-aos="fade-left">
            {/* Placeholder for a role-specific image if desired */}
            <img src="/assets/accountant-hero.jpg" alt="Accountant at work" className="role-img" />
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section className="role-services-section common-section" id="services">
        <h2 className="section-title" data-aos="fade-up">My Accounting Services</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Tailored Financial Expertise</p>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              aos="fade-up"
              aosDelay={index * 100}
            />
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Request a Consultation <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section className="role-projects-section common-section" id="projects">
        <h2 className="section-title" data-aos="fade-up">Accounting Projects</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Key Engagements & Case Studies</p>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              image={project.image}
              title={project.title}
              category={project.category}
              description={project.description}
              detailsLink={project.detailsLink}
              aos="fade-up"
              aosDelay={index * 100}
              isInternalLink={false} // These are often external or lead to contact
            />
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Discuss Your Project <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Stats Section --- */}
      {stats.length > 0 && (
      <section className="role-stats-section common-section" id="stats">
        <h2 className="section-title" data-aos="fade-up">My Achievements</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Impact & Results</p>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index} data-aos="zoom-in" data-aos-delay={index * 150}>
              <AnimatedNumber value={parseFloat(stat.number.replace('+', ''))} duration={2000} />
              <span className="stat-unit">{stat.number.includes('+') ? '+' : ''}</span>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* --- Skills Section --- */}
      {skills.length > 0 && (
      <section className="role-skills-section common-section" id="skills">
        <h2 className="section-title" data-aos="fade-up">Accounting Skillset</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Core Proficiencies</p>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <CircularProgressBar
              key={index}
              skill={skill.skill}
              percentage={skill.percentage}
              aos="zoom-in"
              aosDelay={index * 100}
            />
          ))}
        </div>
      </section>
      )}

      {/* --- Experience Section --- */}
      {experience.length > 0 && (
      <section className="role-experience-section common-section" id="experience">
        <h2 className="section-title" data-aos="fade-up">Accounting Experience</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">My Professional Journey in Finance</p>
        <div className="experience-timeline">
          {experience.map((exp, index) => (
            <div className="timeline-item" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="timeline-dot"></div>
              <div className="timeline-content card">
                <h3>{exp.title}</h3>
                <p className="company">{exp.company}</p>
                <span className="years">{exp.years}</span>
                <p className="description">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* --- Testimonials Section --- */}
      <section className="role-testimonials-section common-section" id="testimonials">
        <h2 className="section-title" data-aos="fade-up">Client Endorsements</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">What My Accounting Clients Say</p>
        <TestimonialCarousel
          testimonials={testimonials}
          aos="fade-up"
          aosDelay={200}
        />
      </section>

      {/* --- Pricing Section --- */}
      {pricing && (
      <section className="role-pricing-section common-section" id="pricing">
        <h2 className="section-title" data-aos="fade-up">Accounting Service Packages</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Transparent Pricing for Your Financial Needs</p>
        <div className="pricing-cards-container">
          <div className="pricing-card card" data-aos="zoom-in" data-aos-delay="100">
            <h3>{pricing.name}</h3>
            <p className="price">{pricing.price}</p>
            <ul className="features-list">
              {pricing.features.map((feature, index) => (
                <li key={index}><FaArrowRight /> {feature}</li>
              ))}
            </ul>
            <p className="pricing-note">{pricing.note}</p>
            <Button to="/contact" variant="primary">Get a Quote</Button>
          </div>
          {/* Add more pricing cards if you have multiple tiers */}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Have a Custom Requirement? Let's Discuss <FaArrowRight />
          </Link>
        </div>
      </section>
      )}
    </div>
  );
};

export default Accountant;