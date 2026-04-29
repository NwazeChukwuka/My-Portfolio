// src/pages/DataAnalyst.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import local data
import usePortfolioContent from '../hooks/usePortfolioContent';

// Import UI Components
import Button from '../components/UI/Button';
import ServiceCard from '../components/UI/ServiceCard';
import ProjectCard from '../components/UI/ProjectCard';
import CircularProgressBar from '../components/UI/CircularProgressBar';
import TestimonialCarousel from '../components/UI/TestimonialCarousel';
import AnimatedNumber from '../components/UI/AnimatedNumber';

// Import Icons for call-to-actions
import { FaArrowRight, FaDownload } from 'react-icons/fa';

import './RolePage.css'; // General styles for all role pages
import './DataAnalyst.css'; // Specific overrides/additions for Data Analyst page

/**
 * Data Analyst Page Component
 * Displays detailed information about Mazi Chukwuka's services,
 * projects, skills, and experience as a Data Analyst.
 */
const DataAnalyst = () => {
  const personalData = usePortfolioContent();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // Scroll to section based on hash in URL
    const { hash } = window.location;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const dataAnalyst = personalData.dataAnalyst || {};
  const cvs = personalData.general?.cvs || {};

  // Map existing data model to page model with safe fallbacks.
  const {
    title,
    introduction = [],
    services = [],
    projects = [],
    skills = [],
    testimonials = [],
    stats = [],
    experience = [],
    pricing = []
  } = dataAnalyst;
  const pageTitle = title;
  const bio = introduction.join(' ');
  const levelToPercent = { Expert: 95, Advanced: 85, Intermediate: 70, Beginner: 50 };
  const normalizedSkills = skills
    .map((item) => ({
      skill: item.skill || item.name || 'Skill',
      percentage: Number.isFinite(Number(item.percentage))
        ? Number(item.percentage)
        : (levelToPercent[item.level] || 0),
    }))
    .filter((item) => item.percentage > 0);

  return (
    <div className="role-page data-analyst-page">
      {/* --- Hero/Banner Section --- */}
      <section className="role-hero-section" id="data-analyst-home">
        <div className="role-hero-content">
          <div className="role-hero-text" data-aos="fade-right">
            <p className="role-greeting">My Expertise as a</p>
            <h1 className="role-hero-title">{pageTitle}</h1>
            <p className="role-hero-bio">{bio}</p>
            <div className="role-hero-buttons">
              <Button to="/contact" variant="primary">Unlock Your Data</Button>
              <Button href={cvs.dataAnalyst} target="_blank" rel="noopener noreferrer" variant="secondary">
                Download Data Analyst CV <FaDownload />
              </Button>
            </div>
          </div>
          <div className="role-hero-image" data-aos="fade-left">
            {/* Placeholder for a role-specific image */}
            <img src="/assets/data-analyst-hero.jpg" alt="Data Analyst working with visualizations" className="role-img" />
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section className="role-services-section common-section" id="services">
        <h2 className="section-title" data-aos="fade-up">Data Analysis Services</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Turning Raw Data into Actionable Insights</p>
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
            Discuss Your Data Needs <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section className="role-projects-section common-section" id="projects">
        <h2 className="section-title" data-aos="fade-up">Data Analysis Projects</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Exploring Complex Data & Delivering Clarity</p>
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
              isInternalLink={false} // These might link to external case studies or contact
            />
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Explore My Data Case Studies <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Stats Section --- */}
      {stats.length > 0 && (
      <section className="role-stats-section common-section" id="stats">
        <h2 className="section-title" data-aos="fade-up">My Data Impact</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Quantifiable Results from Data Insights</p>
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
      {normalizedSkills.length > 0 && (
      <section className="role-skills-section common-section" id="skills">
        <h2 className="section-title" data-aos="fade-up">Data Analysis Skillset</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">From ETL to Visualization</p>
        <div className="skills-grid">
          {normalizedSkills.map((skill, index) => (
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
        <h2 className="section-title" data-aos="fade-up">Data Analyst Experience</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">My Journey in Data-Driven Problem Solving</p>
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
        <h2 className="section-title" data-aos="fade-up">Client Testimonials</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">What My Data Clients Have Said</p>
        <TestimonialCarousel
          testimonials={testimonials}
          aos="fade-up"
          aosDelay={200}
        />
      </section>

      {/* --- Pricing Section --- */}
      {pricing.length > 0 && (
      <section className="role-pricing-section common-section" id="pricing">
        <h2 className="section-title" data-aos="fade-up">Data Analysis Pricing</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Tailored Solutions for Your Data Challenges</p>
        <div className="pricing-cards-container">
          {pricing.map((tier, index) => (
            <div className="pricing-card card" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
              <h3>{tier.name}</h3>
              <p className="price">{tier.price}</p>
              <ul className="features-list">
                {tier.features.map((feature, idx) => (
                  <li key={idx}><FaArrowRight /> {feature}</li>
                ))}
              </ul>
              <p className="pricing-note">{tier.note}</p>
              <Button to="/contact" variant="primary">Get a Data Strategy</Button>
            </div>
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Have a Complex Data Challenge? Let's Discuss <FaArrowRight />
          </Link>
        </div>
      </section>
      )}
    </div>
  );
};

export default DataAnalyst;