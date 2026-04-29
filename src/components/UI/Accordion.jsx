// src/components/UI/Accordion.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Chevron icon for expand/collapse
import './Accordion.css'; // Specific styles for the Accordion

/**
 * Accordion Component
 * A reusable component for creating collapsible content sections.
 * Ideal for FAQs, expandable lists, or detailed information.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - The title displayed in the accordion header.
 * @param {React.ReactNode} props.children - The content to be displayed when the accordion is open.
 * @param {boolean} [props.isOpenInitially=false] - Whether the accordion should be open by default.
 */
const Accordion = ({ title, children, isOpenInitially = false }) => {
  // State to manage the open/closed status of the accordion
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  // Ref to measure the content height for smooth transition
  const contentRef = useRef(null);

  /**
   * Toggles the open/closed state of the accordion.
   */
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Set the max-height of the content for CSS transition
  // This effect runs whenever 'isOpen' changes
  useEffect(() => {
    if (contentRef.current) {
      // If accordion is open, set max-height to scrollHeight (actual content height)
      // Otherwise, set to 0 to collapse
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className="accordion-item" data-aos="fade-up">
      <button
        className={`accordion-header ${isOpen ? 'open' : ''}`}
        onClick={toggleAccordion}
        aria-expanded={isOpen} // ARIA attribute for accessibility
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-')}`} // Link to content for screen readers
      >
        <h3 className="accordion-title">{title}</h3>
        <FaChevronDown className={`accordion-icon ${isOpen ? 'rotate' : ''}`} />
      </button>
      <div
        ref={contentRef}
        className="accordion-content"
        id={`accordion-content-${title.replace(/\s+/g, '-')}`}
        role="region" // ARIA role for a perceivable content section
        aria-labelledby={`accordion-header-${title.replace(/\s+/g, '-')}`} // Link to header for screen readers
      >
        <div className="accordion-body">
          {children} {/* Render the child content */}
        </div>
      </div>
    </div>
  );
};

export default Accordion;