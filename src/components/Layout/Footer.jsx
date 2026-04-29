// src/components/Layout/Footer.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLinkedin, FaTwitter, FaGithub, FaWhatsapp,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp,
} from 'react-icons/fa';
import personalData from '../../data/personalData';
import useSiteSettings from '../../hooks/useSiteSettings';
import './Footer.css';

/**
 * Footer Component
 * Comprehensive footer with contact info, links, and social media
 */
const Footer = () => {
  const { general: overrideGeneral, contact: overrideContact } = useSiteSettings();
  const { general, contact } = {
    general: overrideGeneral || personalData.general,
    contact: overrideContact || personalData.contact,
  };
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 360);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Quick links configuration
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Resources', path: '/resources' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  // Services/roles links
  const serviceLinks = [
    { name: 'Web Development', path: '/web-developer' },
    { name: 'Data Analysis', path: '/data-analyst' },
  ];

  // Social media links
  const socialMediaLinks = [
    {
      name: 'LinkedIn',
      url: contact.linkedin,
      icon: FaLinkedin,
      color: '#0077b5'
    },
    {
      name: 'GitHub',
      url: contact.github,
      icon: FaGithub,
      color: '#333'
    },
    {
      name: 'Twitter',
      url: contact.twitter,
      icon: FaTwitter,
      color: '#1da1f2'
    },
    {
      name: 'WhatsApp',
      url: contact.socialLinks?.whatsapp || contact.whatsapp,
      icon: FaWhatsapp,
      color: '#25d366'
    }
  ].filter(link => link.url); // Only include links that exist

  return (
    <footer className="footer" role="contentinfo">
      {/* Back to top button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        aria-hidden={!showBackToTop}
      >
        <FaArrowUp />
      </button>

      <div className="footer-container">
        {/* About section */}
        <div className="footer-section footer-about">
          <h3>{general.fullName || 'Your Name'}</h3>
          <p className="footer-tagline">
            {general.tagline || 'Multidisciplinary Professional'}
          </p>
          <p className="footer-description">
            {general.bio || 'Delivering excellence in accounting, web development, data analysis, and academic research.'}
          </p>
          
          {/* Contact information */}
          <div className="footer-contact-info">
            {contact.email && (
              <div className="contact-item">
                <FaEnvelope />
                <a 
                  href={`mailto:${contact.email}`}
                  aria-label={`Send email to ${contact.email}`}
                >
                  {contact.email}
                </a>
              </div>
            )}
            
            {contact.phone && (
              <div className="contact-item">
                <FaPhone />
                <a 
                  href={`tel:${contact.phone}`}
                  aria-label={`Call ${contact.phone}`}
                >
                  {contact.phone}
                </a>
              </div>
            )}
            
            {contact.address && (
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>{contact.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick links section */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services section */}
        <div className="footer-section footer-services">
          <h3>Services</h3>
          <ul>
            {serviceLinks.map((service) => (
              <li key={service.path}>
                <Link to={service.path}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect section */}
        <div className="footer-section footer-social">
          <h3>Connect</h3>
          <p className="social-description">
            Follow me on social media for updates and insights
          </p>
          
          <div className="social-icons">
            {socialMediaLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={`Follow me on ${social.name}`}
                style={{ '--social-color': social.color }}
              >
                <social.icon />
              </a>
            ))}
          </div>

          {/* Newsletter signup placeholder */}
          {/* <div className="newsletter-signup">
            <h4>Stay Updated</h4>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div> */}
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>
              &copy; {currentYear} {general.fullName || 'Your Name'}. All rights reserved.
            </p>
          </div>
          
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;