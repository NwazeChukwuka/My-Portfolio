// src/pages/Contact.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaWhatsapp } from 'react-icons/fa';

import { createContactMessage } from '../lib/portfolioApi';
import usePortfolioContent from '../hooks/usePortfolioContent';
import { validateContactForm } from '../lib/inputSanitization';
import { getUserFriendlyError, getSuccessMessage, formatErrorForDisplay } from '../lib/errorMessages';
import { logger } from '../lib/logger';

import './Contact.css'; // Page-specific styles for Contact

/**
 * Contact Page Component
 * Displays contact information and a contact form.
 */
const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0); // Ensure scroll to top on page load
  }, []);

  const { contact = {} } = usePortfolioContent();

  // State for form fields (for UI control, not submission logic)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate and sanitize all form data
    const validation = validateContactForm(formData);
    
    if (!validation.isValid) {
      // Show the first error message
      const firstError = Object.values(validation.errors)[0];
      const errorInfo = formatErrorForDisplay({
        title: 'Validation Error',
        message: firstError,
        action: 'Check Form',
        canRetry: true
      });
      
      setSubmitStatus({
        type: 'error',
        text: errorInfo.message,
        title: errorInfo.title,
        action: errorInfo.action
      });
      return;
    }

    try {
      await createContactMessage({
        name: validation.sanitized.name,
        email: validation.hasEmail ? validation.sanitized.email : null,
        phone: validation.hasPhone ? validation.sanitized.phone : null,
        subject: validation.sanitized.subject,
        message: validation.sanitized.message,
        source: 'website_contact_form'
      });

      const successInfo = getSuccessMessage('contact_form');
      setSubmitStatus({
        type: 'success',
        text: successInfo.message,
        title: successInfo.title,
        action: successInfo.action
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      logger.error('Contact form submit failed:', error);
      
      const userFriendlyError = getUserFriendlyError(error, { type: 'contact_form' });
      const errorInfo = formatErrorForDisplay(userFriendlyError);
      
      setSubmitStatus({
        type: 'error',
        text: errorInfo.message,
        title: errorInfo.title,
        action: errorInfo.action
      });
    }
  };

  return (
    <div className="contact-page">
      {/* --- Page Hero/Banner Section --- */}
      <section className="contact-hero-section">
        <div className="contact-hero-content" data-aos="fade-up">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">I'd love to hear from you. Let's connect and discuss your needs.</p>
        </div>
      </section>

      {/* --- Contact Details and Form Section --- */}
      <section className="contact-details-form-section common-section">
        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info card" data-aos="fade-right">
            <h2>Contact Information</h2>
            <p className="contact-info-description">
              Whether you have a question, a project proposal, or just want to say hello, feel free to reach out. I'm always open to new opportunities and collaborations.
            </p>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <span>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></span>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <span>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>Location: {contact.address}</span>
            </div>
            <div className="social-links">
              <h3>Connect with me:</h3>
              {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
              {contact.twitter && <a href={contact.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
              {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
              {(contact.socialLinks?.whatsapp || contact.whatsapp) && (
                <a href={contact.socialLinks?.whatsapp || contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                </a>
              )}
              {/* Add other social links as needed */}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container card" data-aos="fade-left">
            <h2>Send Me a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form" noValidate id="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  aria-describedby="name-error"
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Your Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  aria-describedby="phone-error"
                  autoComplete="tel"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject of your message"
                  required
                  aria-describedby="subject-error"
                  autoComplete="subject"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                  aria-describedby="message-error"
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
              <p className="form-note">Provide at least one contact method: email or phone.</p>
              {submitStatus.text && (
                <div 
                  className={`form-note ${submitStatus.type === 'error' ? 'error-note' : 'success-note'}`}
                  role={submitStatus.type === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                >
                  {submitStatus.title && <strong>{submitStatus.title}</strong>}
                  <p>{submitStatus.text}</p>
                  {submitStatus.action && (
                    <small className="form-action-hint">
                      💡 {submitStatus.action}
                    </small>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;