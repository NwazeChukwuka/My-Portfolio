// src/components/UI/TestimonialCarousel.jsx
import React from 'react';
import Slider from 'react-slick'; // Import the Slider component
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'; // Quote icons
import './TestimonialCarousel.css'; // Specific styles for the carousel
// Import default slick-carousel styles (Crucial for carousel to work)
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * TestimonialCarousel Component
 * Displays a list of testimonials in an interactive carousel format.
 * Utilizes react-slick for robust carousel functionality.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.testimonials - An array of testimonial objects.
 * Each object should have:
 * - {string} quote: The testimonial text.
 * - {string} name: The name of the person giving the testimonial.
 * - {string} title: The title/position of the person.
 * - {string} [image]: Optional path to the person's image.
 * @param {string} [props.aos='fade-up'] - AOS animation type for the carousel container.
 * @param {number} [props.aosDelay=0] - Delay for AOS animation in milliseconds.
 */
const TestimonialCarousel = ({ testimonials, aos = 'fade-up', aosDelay = 0 }) => {
  // react-slick settings
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the carousel
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Auto-play the carousel
    autoplaySpeed: 5000, // Time between slide transitions (5 seconds)
    arrows: false, // Hide default arrows (we'll use custom styling for dots if needed)
    fade: true, // Fade effect instead of slide
    cssEase: 'linear', // Smooth fade transition
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="no-testimonials" data-aos={aos} data-aos-delay={aosDelay}>
        <p>No testimonials available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="testimonial-carousel-container" data-aos={aos} data-aos-delay={aosDelay}>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          (() => {
            const authorName = testimonial.name || testimonial.author || 'Client';
            const authorTitle = testimonial.title || testimonial.role || '';
            return (
          <div key={index} className="testimonial-slide">
            <div className="testimonial-card card">
              <FaQuoteLeft className="quote-icon quote-left" />
              <p className="testimonial-quote">{testimonial.quote}</p>
              <FaQuoteRight className="quote-icon quote-right" />
              <div className="testimonial-author">
                {testimonial.image && (
                  <img src={testimonial.image} alt={authorName} className="author-image" loading="lazy" decoding="async" />
                )}
                <div className="author-info">
                  <h4 className="author-name">{authorName}</h4>
                  <p className="author-title">{authorTitle}</p>
                </div>
              </div>
            </div>
          </div>
            );
          })()
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialCarousel;