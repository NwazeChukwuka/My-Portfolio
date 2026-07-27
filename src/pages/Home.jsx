// src/pages/Home.jsx - Final Corrected Version
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import usePortfolioContent from '../hooks/usePortfolioContent';

// Import UI Components
import Button from '../components/UI/Button';
import ServiceCard from '../components/UI/ServiceCard';
import ProjectCard from '../components/UI/ProjectCard';
import CircularProgressBar from '../components/UI/CircularProgressBar';
import TestimonialCarousel from '../components/UI/TestimonialCarousel';

// Import Icons
import {
  FaLinkedinIn, FaGithub, FaWhatsapp, FaTwitter, FaFacebookF,
  FaArrowRight
} from 'react-icons/fa';

import './Home.css';

const Home = () => {
  const [isCvSelectorOpen, setIsCvSelectorOpen] = useState(false);
  const [isContactChooserOpen, setIsContactChooserOpen] = useState(false);
  const mergedData = usePortfolioContent();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50,
    });
  }, []);

  const latestBlogArticles = useMemo(() => {
    const list = mergedData.blogArticlesList || [];
    return list.slice(0, 3);
  }, [mergedData.blogArticlesList]);

  const {
    homeSkills = [],
    homeExperience = [],
    homeTestimonials = [],
    homeServices = [],
    homePortfolioPreviews = [],
    projectsFromDb = [],
    contact = {},
    general: gen = {},
  } = mergedData;

  const name = gen.fullName || '';
  const profilePicture = gen.profilePicture || '/assets/Me 1.webp';
  const secondaryProfilePicture = gen.secondaryProfilePicture || '/assets/Me 2.webp';
  const blendedTitle = gen.tagline || '';
  const aboutArr = Array.isArray(gen.aboutMe) ? gen.aboutMe : ['', ''];
  const shortBio = aboutArr[0] || '';
  const longBio = aboutArr[1] || '';
  const cvs = gen.cvs || {};

  const featuredProjects = useMemo(() => {
    const fromDb = projectsFromDb || [];
    const fallback = homePortfolioPreviews || [];
    const source = fromDb.length ? fromDb : fallback;
    return source.slice(0, 3);
  }, [projectsFromDb, homePortfolioPreviews]);

  const serviceSlug = (title) => String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const cvOptions = [
    { key: 'full', label: 'General CV' },
    { key: 'webDeveloper', label: 'Web Developer CV' },
    { key: 'dataAnalyst', label: 'Data Analyst CV' },
  ];

  return (
    <div className="home-page">
      {/* Enhanced Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text" data-aos="fade-right">
            <h1 className="hero-title">
              <span className="name-highlight">{name}</span>
            </h1>
            <h2 className="hero-subtitle">
              <span className="typing-animation">{blendedTitle}</span>
            </h2>
          </div>

          <div className="hero-image" data-aos="fade-left" data-aos-delay="200">
            <div className="image-container layered-hero-visual">
              <img src={profilePicture} alt={name} className="profile-img" />
              <div className="hero-proof-card card">
                <p>Worked on 100+ projects.</p>
                <div className="hero-proof-footer">
                  <div className="hero-proof-avatars">
                    <span className="hero-proof-avatar">M</span>
                    <span className="hero-proof-avatar">A</span>
                    <span className="hero-proof-avatar">D</span>
                  </div>
                  <strong>50+ Clients</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-content-extended" data-aos="fade-up" data-aos-delay="400">
            <p className="hero-bio">{shortBio}</p>
            
            <div className="hero-stats" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-item">
                <span className="stat-number">6+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>

            <div className="hero-buttons">
              <Button to="/portfolio" variant="primary" className="pulse-animation">
                View Work
              </Button>
              <Button onClick={() => setIsContactChooserOpen(true)} variant="secondary" className="download-cv-btn">
                Contact Me
              </Button>
            </div>

            <div className="hero-social-links">
              <p className="social-label">Connect with me:</p>
              <div className="social-icons">
                {contact.socialLinks.linkedin && (
                  <a href={contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link linkedin">
                    <FaLinkedinIn />
                  </a>
                )}
                {contact.socialLinks.github && (
                  <a href={contact.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-link github">
                    <FaGithub />
                  </a>
                )}
                {contact.socialLinks.whatsapp && (
                  <a href={contact.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link whatsapp">
                    <FaWhatsapp />
                  </a>
                )}
                {contact.socialLinks.twitter && (
                  <a href={contact.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link twitter">
                    <FaTwitter />
                  </a>
                )}
                {contact.socialLinks.facebook && (
                  <a href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook">
                    <FaFacebookF />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bg-elements">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="about-section common-section" id="about">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">About Me</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            My Journey & Expertise
          </p>
        </div>
        
        <div className="about-content">
          <div className="about-text" data-aos="fade-right">
            <h3>More About {name.split(' ')[0]}</h3>
            <p className="about-description">{longBio}</p>

            {/* Note: Certifications section has been removed as the data is not present in personalData.js */}
            <div className="about-actions">
              <Button to="/contact" variant="primary">
                Get In Touch
              </Button>
              <Button to="/about" variant="outline">
                Learn More About Me
              </Button>
            </div>
          </div>
          
          <div className="about-image" data-aos="fade-left">
            <div className="about-image-container">
              <img src={secondaryProfilePicture} alt={`${name} - Professional Photo`} />
              <div className="about-image-overlay">
                {homeExperience.length > 0 && (
                <div className="experience-badge">
                  <span className="badge-number">{homeExperience.length}+</span>
                  <span className="badge-text">Years Experience</span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="services-section common-section bg-gradient" id="services">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">My Core Services</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            What I Offer Across My Roles
          </p>
        </div>
        
        <div className="services-grid">
          {homeServices.map((service, index) => (
            <Link key={service.title || index} to={`/services/${serviceSlug(service.title)}`} className="service-card-link">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                aos="fade-up"
                aosDelay={index * 100}
              />
            </Link>
          ))}
        </div>
        
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <div className="cta-container">
            <h3>Ready to Start a Project?</h3>
            <p>Let's discuss how I can help bring your ideas to life.</p>
            <Link to="/contact" className="cta-button">
              Let's Talk! <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured projects — from Supabase when configured */}
      {featuredProjects.length > 0 && (
      <section className="portfolio-section common-section" id="portfolio">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Featured Projects</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            A Glimpse into My Work
          </p>
        </div>
        
        <div className="portfolio-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              image={project.image}
              title={project.title}
              category={project.category}
              description={project.description}
              detailsLink={project.detailsLink}
              technologies={project.technologies}
              aos="fade-up"
              aosDelay={index * 100}
              className="enhanced-project-card"
            />
          ))}
        </div>
        
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/portfolio" className="learn-more-link">
            View All Projects <FaArrowRight />
          </Link>
        </div>
      </section>
      )}

      {/* Enhanced Skills Section */}
      {homeSkills.length > 0 && (
      <section className="skills-section common-section bg-dark" id="skills">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">My Key Skills</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            Proficiencies Across Disciplines
          </p>
        </div>
        
        <div className="skills-container">
          <div className="skills-grid">
            {homeSkills.map((skill, index) => (
              <CircularProgressBar
                key={index}
                skill={skill.skill}
                percentage={skill.percentage}
                color={skill.color}
                aos="zoom-in"
                aosDelay={index * 100}
                showAnimation={true}
                animateOnClick
              />
            ))}
          </div>
          
        </div>
        
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/about" className="learn-more-link light">
            Explore My Full Skillset <FaArrowRight />
          </Link>
        </div>
      </section>
      )}

      {/* Experience Section */}
      {homeExperience.length > 0 && (
      <section className="experience-section common-section" id="experience">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Professional Journey</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            My Work History & Achievements
          </p>
        </div>
        
        <div className="experience-timeline">
          {homeExperience.map((exp, index) => (
            <div className="timeline-item" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="timeline-dot"></div>
              <div className="timeline-content card">
                <div className="exp-header">
                  <h3>{exp.title}</h3>
                  <span className="years-badge">{exp.years}</span>
                </div>
                <p className="company">{exp.company}</p>
                <p className="description">{exp.description}</p>
                {exp.achievements && (
                  <ul className="achievements">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Enhanced Testimonials Section */}
      {homeTestimonials.length > 0 && (
      <section className="testimonials-section common-section bg-gradient" id="testimonials">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">What Clients Say</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            Hear From Those I've Worked With
          </p>
        </div>
        
        <TestimonialCarousel
          testimonials={homeTestimonials}
          aos="fade-up"
          aosDelay={200}
          autoPlay={true}
          showDots={true}
        />
      </section>
      )}

      {/* Blog teaser — from Supabase blog_posts */}
      {latestBlogArticles.length > 0 && (
      <section className="blog-teaser-section common-section" id="blog-teasers">
        <div className="section-header">
          <h2 className="section-title" data-aos="fade-up">Latest Insights</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            From My Blog & Thoughts
          </p>
        </div>
        
        <div className="blog-teasers-grid">
          {latestBlogArticles.map((article, index) => (
            <article className="blog-teaser-card card" key={article.id} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="blog-image-container">
                <img src={article.image} alt={article.title} className="blog-teaser-image" />
                <div className="blog-overlay">
                  <span className="read-time">{article.readTime || '5 min read'}</span>
                </div>
              </div>
              <div className="blog-teaser-content">
                <div className="blog-meta">
                  <span className="blog-category">{article.category}</span>
                  <time className="blog-date">
                    {article.date ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  </time>
                </div>
                <h3 className="blog-teaser-title">{article.title}</h3>
                <p className="blog-teaser-snippet">{article.snippet || article.preview}</p>
                <Link to={`/blog/${article.slug}`} className="read-more-link">
                  Read Full Article <FaArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="section-action" data-aos="fade-up" data-aos-delay="300">
          <Link to="/blog" className="learn-more-link">
            View All Blog Posts <FaArrowRight />
          </Link>
        </div>
      </section>
      )}

      {/* Call-to-Action Section */}
      <section className="cta-section common-section bg-primary" id="cta">
        <div className="cta-content" data-aos="zoom-in">
          <h2>Ready to Work Together?</h2>
          <p>Let's discuss your project and see how I can help you achieve your goals.</p>
          <div className="cta-buttons">
            <Button to="/contact" variant="secondary" size="large">
              Start a Project
            </Button>
            <Button to="/portfolio" variant="outline-white" size="large">
              View My Work
            </Button>
          </div>
        </div>
      </section>

      {isCvSelectorOpen && (
        <div
          className="cv-selector-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsCvSelectorOpen(false);
            }
          }}
        >
          <div className="cv-selector-modal" role="dialog" aria-modal="true" aria-label="Select CV to download">
            <div className="cv-selector-header">
              <h3>Select a CV</h3>
              <button type="button" onClick={() => setIsCvSelectorOpen(false)} aria-label="Close CV selector">
                x
              </button>
            </div>
            <p className="cv-selector-subtitle">Choose the CV that matches your interest.</p>
            <div className="cv-selector-grid">
              {cvOptions.map((option) => {
                const url = cvs?.[option.key];
                return (
                  <a
                    key={option.key}
                    href={url || '#'}
                    className={`cv-selector-item ${url ? '' : 'disabled'}`}
                    target={url ? '_blank' : undefined}
                    rel={url ? 'noopener noreferrer' : undefined}
                    onClick={(event) => {
                      if (!url) {
                        event.preventDefault();
                      } else {
                        setIsCvSelectorOpen(false);
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    <small>{url ? 'Download' : 'Not uploaded yet'}</small>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {isContactChooserOpen && (
        <div
          className="contact-chooser-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsContactChooserOpen(false);
            }
          }}
        >
          <div className="contact-chooser-modal" role="dialog" aria-modal="true" aria-label="Choose contact method">
            <div className="contact-chooser-header">
              <h3>Choose Contact Method</h3>
              <button type="button" onClick={() => setIsContactChooserOpen(false)} aria-label="Close contact method chooser">
                x
              </button>
            </div>
            <p className="contact-chooser-subtitle">Select how you want to reach me.</p>
            <div className="contact-chooser-grid">
              {contact?.socialLinks?.whatsapp && (
                <a href={contact.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-chooser-item">
                  <span>WhatsApp</span>
                  <small>Fast response</small>
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="contact-chooser-item">
                  <span>Email</span>
                  <small>{contact.email}</small>
                </a>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="contact-chooser-item">
                  <span>Phone Call</span>
                  <small>{contact.phone}</small>
                </a>
              )}
              <Link to="/contact" className="contact-chooser-item" onClick={() => setIsContactChooserOpen(false)}>
                <span>Open Contact Form</span>
                <small>Write detailed message</small>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;