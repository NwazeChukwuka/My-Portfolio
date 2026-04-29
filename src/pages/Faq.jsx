// src/pages/Faq.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Icons for accordion

// Import local data (assuming you'll add FAQs data here)
import usePortfolioContent from '../hooks/usePortfolioContent';

import './Faq.css'; // Page-specific styles for FAQs

/**
 * FAQ Page Component
 * Displays a list of frequently asked questions with toggleable answers.
 */
const Faq = () => {
  const personalData = usePortfolioContent();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0); // Ensure scroll to top on page load
  }, []);

  const { faqs } = personalData; // Assuming personalData will contain a 'faqs' array

  const [activeIndex, setActiveIndex] = useState(null); // State to manage active accordion item

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* --- Page Hero/Banner Section --- */}
      <section className="faq-hero-section">
        <div className="faq-hero-content" data-aos="fade-up">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">Find Answers to Common Inquiries About My Services & Expertise</p>
        </div>
      </section>

      {/* --- FAQ Accordion Section --- */}
      <section className="faq-accordion-section common-section">
        {faqs.length > 0 ? (
          <div className="accordion-container">
            {faqs.map((faq, index) => (
              <div
                className={`accordion-item card ${activeIndex === index ? 'active' : ''}`}
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <button className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <h3>{faq.question}</h3>
                  <span className="accordion-icon">
                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>
                <div
                  className="accordion-content"
                  style={{ maxHeight: activeIndex === index ? '200px' : '0' }} /* Adjust max-height as needed */
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-faqs-message" data-aos="fade-up">No FAQs available at the moment. Please check back later!</p>
        )}
      </section>

      {/* Optional: Call to Action for unanswered questions */}
      <section className="faq-cta-section common-section" data-aos="fade-up">
        <h2 className="section-title">Still Have Questions?</h2>
        <p className="section-subtitle">If you didn't find your answer here, feel free to reach out directly.</p>
        <Link to="/contact" className="contact-faq-btn">Contact Me</Link>
      </section>
    </div>
  );
};

export default Faq;