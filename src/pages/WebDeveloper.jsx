// src/pages/WebDeveloper.jsx
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
import './WebDeveloper.css'; // Specific overrides/additions for Web Developer page

/**
 * Web Developer Page Component
 * Displays detailed information about Mazi Chukwuka's services,
 * projects, skills, and experience as a Web Developer.
 */
const WebDeveloper = () => {
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

  const webDeveloper = personalData.webDeveloper || {};
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
  } = webDeveloper;
  const pageTitle = title;
  const bio = (introduction || []).join(' ');
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
    <div className="role-page web-developer-page">
      {/* --- Hero/Banner Section --- */}
      <section className="role-hero-section" id="webdev-home">
        <div className="role-hero-content">
          <div className="role-hero-text" data-aos="fade-right">
            <h1 className="role-hero-title">{pageTitle}</h1>
          </div>
          <div className="role-hero-image" data-aos="fade-left">
            {/* Placeholder for a role-specific image */}
            <img src={webDeveloper.heroImage || '/assets/Me 2.webp'} alt="Web Developer coding" className="role-img" />
          </div>
          <div className="role-hero-extended" data-aos="fade-up" data-aos-delay="200">
            <p className="role-hero-bio">{bio}</p>
            <div className="role-hero-buttons">
              <Button to="/contact" variant="primary">Start Your Project</Button>
              <Button href={cvs.webDeveloper} target="_blank" rel="noopener noreferrer" variant="secondary">
                Download Web Dev CV <FaDownload />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      {services.length > 0 && (
      <section className="role-services-section common-section" id="services">
        <h2 className="section-title" data-aos="fade-up">Web Development Services</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Bringing Your Digital Vision to Life</p>
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
            Discuss Your Web Project <FaArrowRight />
          </Link>
        </div>
      </section>
      )}

      {/* --- Projects Section --- */}
      <section className="role-projects-section common-section" id="projects">
        <h2 className="section-title" data-aos="fade-up">Web Development Projects</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Showcasing My Digital Creations</p>
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
              isInternalLink={true} // Assuming these might link to detailed portfolio entries
            />
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/portfolio" className="learn-more-link">
            View All Web Projects <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Stats Section --- */}
      {stats.length > 0 && (
      <section className="role-stats-section common-section" id="stats">
        <h2 className="section-title" data-aos="fade-up">My Web Dev Impact</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Success Metrics & Growth</p>
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
        <h2 className="section-title" data-aos="fade-up">Web Development Skillset</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Front-end, Back-end & Tools</p>
        <div className="skills-grid">
          {normalizedSkills.map((skill, index) => (
            <CircularProgressBar
              key={index}
              skill={skill.skill}
              percentage={skill.percentage}
              aos="zoom-in"
              aosDelay={index * 100}
              animateOnClick
            />
          ))}
        </div>
      </section>
      )}

      {/* --- Experience Section --- */}
      {experience.length > 0 && (
      <section className="role-experience-section common-section" id="experience">
        <h2 className="section-title" data-aos="fade-up">Web Dev Experience</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">My Journey in Building the Web</p>
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
        <h2 className="section-title" data-aos="fade-up">Client Feedback</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">What My Web Clients Say</p>
        <TestimonialCarousel
          testimonials={testimonials}
          aos="fade-up"
          aosDelay={200}
        />
      </section>

      {/* --- Pricing Section --- */}
      {pricing.length > 0 && (
      <section className="role-pricing-section common-section" id="pricing">
        <h2 className="section-title" data-aos="fade-up">Web Development Packages</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Transparent Pricing for Digital Solutions</p>
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
              <Button to="/contact" variant="primary">Get Started</Button>
            </div>
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Need a Custom Web Solution? Let's Talk! <FaArrowRight />
          </Link>
        </div>
      </section>
      )}
    </div>
  );
};

export default WebDeveloper;