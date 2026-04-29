// src/pages/ResearchAcademic.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import local data
import personalData from '../data/personalData';

// Import UI Components
import Button from '../components/UI/Button';
import ProjectCard from '../components/UI/ProjectCard'; // Re-using for publications/key research
import TestimonialCarousel from '../components/UI/TestimonialCarousel'; // For academic endorsements
import AnimatedNumber from '../components/UI/AnimatedNumber'; // For academic stats
import CircularProgressBar from '../components/UI/CircularProgressBar';

// Import Icons for call-to-actions
import { FaArrowRight, FaDownload, FaBookOpen, FaGlobe, FaFlask } from 'react-icons/fa';

import './RolePage.css'; // General styles for all role pages
import './ResearchAcademic.css'; // Specific overrides/additions for Research & Academic page

/**
 * Research & Academic Page Component
 * Displays detailed information about Mazi Chukwuka's contributions,
 * publications, skills, and experience in research and academia.
 */
const ResearchAcademic = () => {
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

  const researchAcademic = personalData.researchAcademic || {};
  const contact = personalData.contact || {};
  const cvs = personalData.general?.cvs || {};

  // Map existing data model to page model with safe fallbacks.
  const {
    title,
    introduction = [],
    researchAreas = [],
    publications = [],
    stats = [],
    skills = [], // Re-using for research-specific skills
    experience = [],
    testimonials = []
  } = researchAcademic;
  const pageTitle = title;
  const bio = introduction.join(' ');

  return (
    <div className="role-page research-academic-page">
      {/* --- Hero/Banner Section --- */}
      <section className="role-hero-section" id="research-academic-home">
        <div className="role-hero-content">
          <div className="role-hero-text" data-aos="fade-right">
            <p className="role-greeting">My Contributions in</p>
            <h1 className="role-hero-title">{pageTitle}</h1>
            <p className="role-hero-bio">{bio}</p>
            <div className="role-hero-buttons">
              <Button to="/contact" variant="primary">Collaborate / Consult</Button>
              <Button href={cvs.researchAcademic} target="_blank" rel="noopener noreferrer" variant="secondary">
                Download Academic CV <FaDownload />
              </Button>
            </div>
          </div>
          <div className="role-hero-image" data-aos="fade-left">
            {/* Placeholder for a role-specific image */}
            <img src="/assets/research-academic-hero.jpg" alt="Academic research" className="role-img" />
          </div>
        </div>
      </section>

      {/* --- Research Areas Section --- */}
      <section className="research-areas-section common-section" id="research-areas">
        <h2 className="section-title" data-aos="fade-up">Key Research Areas</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Exploring the Frontiers of Knowledge</p>
        <div className="research-areas-grid">
          {researchAreas.map((area, index) => (
            <div className="research-area-card card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="card-icon">{area.icon === 'FaFlask' ? <FaFlask /> : (area.icon === 'FaBookOpen' ? <FaBookOpen /> : <FaGlobe />)}</div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/contact" className="learn-more-link">
            Discuss a Research Project <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* --- Publications Section --- */}
      <section className="role-projects-section common-section" id="publications">
        <h2 className="section-title" data-aos="fade-up">Selected Publications</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">My Contributions to Academic Discourse</p>
        <div className="projects-grid"> {/* Re-using projects-grid for publications */}
          {publications.map((pub, index) => (
            <ProjectCard
              key={pub.id}
              image={pub.image} // Can be a cover image of the paper/journal
              title={pub.title}
              category={pub.category} // e.g., "Journal Article", "Conference Paper"
              description={pub.snippet} // Short abstract/summary
              detailsLink={pub.link} // Link to DOI, ResearchGate, or PDF
              aos="fade-up"
              aosDelay={index * 100}
              isInternalLink={false} // Likely external links to publications
            />
          ))}
        </div>
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <a href={contact.socialLinks?.whatsapp || contact.whatsapp} target="_blank" rel="noopener noreferrer" className="learn-more-link">
            Chat on WhatsApp <FaArrowRight />
          </a>
        </div>
      </section>

      {/* --- Stats Section --- */}
      {stats.length > 0 && (
      <section className="role-stats-section common-section" id="academic-stats">
        <h2 className="section-title" data-aos="fade-up">Academic Achievements</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Key Metrics & Recognition</p>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index} data-aos="zoom-in" data-aos-delay={index * 150}>
              <AnimatedNumber value={parseFloat(stat.number.replace('+', '').replace(',', ''))} duration={2000} />
              <span className="stat-unit">{stat.number.includes('+') ? '+' : ''}</span>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* --- Skills Section (Academic/Research specific) --- */}
      {skills.length > 0 && (
      <section className="role-skills-section common-section" id="academic-skills">
        <h2 className="section-title" data-aos="fade-up">Research Skillset</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Methodology, Analysis & Communication</p>
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

      {/* --- Experience Section (Academic Focus) --- */}
      {experience.length > 0 && (
      <section className="role-experience-section common-section" id="academic-experience">
        <h2 className="section-title" data-aos="fade-up">Academic & Research Experience</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">My Journey in Academia</p>
        <div className="experience-timeline">
          {experience.map((exp, index) => (
            <div className="timeline-item" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="timeline-dot"></div>
              <div className="timeline-content card">
                <h3>{exp.title}</h3>
                <p className="company">{exp.institution}</p>
                <span className="years">{exp.years}</span>
                <p className="description">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* --- Testimonials Section (Academic Endorsements) --- */}
      <section className="role-testimonials-section common-section" id="academic-testimonials">
        <h2 className="section-title" data-aos="fade-up">Academic Endorsements</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">What My Peers & Supervisors Say</p>
        <TestimonialCarousel
          testimonials={testimonials}
          aos="fade-up"
          aosDelay={200}
        />
      </section>

      {/* No explicit "Pricing" section for academic, but a "Collaboration" CTA */}
      <section className="role-cta-section common-section" id="collaboration-cta">
        <div className="cta-content" data-aos="fade-up">
          <h2 className="section-title">Interested in Collaboration?</h2>
          <p className="section-subtitle">Reach out for research partnerships, guest lectures, or academic discussions.</p>
          <Button to="/contact" variant="primary">Let's Connect</Button>
        </div>
      </section>
    </div>
  );
};

export default ResearchAcademic;