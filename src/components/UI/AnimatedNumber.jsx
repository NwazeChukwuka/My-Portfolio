// src/components/UI/AnimatedNumber.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer'; // For detecting when the component is in view

const AnimatedNumber = ({ targetNumber, duration = 2000, suffix = '' }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const ref = useRef(null);
  const [inViewRef, inView] = useInView({
    triggerOnce: true, // Only trigger once when it enters the viewport
    threshold: 0.5,    // Trigger when 50% of the component is visible
  });

  // Combine refs
  const setRefs = (node) => {
    ref.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    if (!inView) {
      // If not in view yet, or if it went out of view and triggerOnce is true, reset to 0
      setCurrentNumber(0); // Reset for potential re-animation if triggerOnce was false, or simply initial state
      return;
    }

    // Only run the animation if the target number is different from the current,
    // and if it's in view for the first time
    if (inView && currentNumber === 0) {
      let start = 0;
      const end = targetNumber;
      const increment = end / (duration / 16); // Approximately 60 frames per second (1000ms / 16ms)

      const counter = setInterval(() => {
        start += increment;
        if (start < end) {
          setCurrentNumber(Math.ceil(start)); // Use Math.ceil to round up for smoother count
        } else {
          setCurrentNumber(end);
          clearInterval(counter);
        }
      }, 16); // Roughly 60 frames per second

      return () => clearInterval(counter); // Cleanup on unmount or re-render
    }
  }, [inView, targetNumber, duration, currentNumber]);

  return (
    <span ref={setRefs} className="animated-number">
      {currentNumber.toLocaleString()}{suffix} {/* Format number with commas */}
    </span>
  );
};

export default AnimatedNumber;