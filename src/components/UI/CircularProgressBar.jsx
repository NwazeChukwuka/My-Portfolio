// src/components/UI/CircularProgressBar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './CircularProgressBar.css'; // Specific styles for the CircularProgressBar

/**
 * CircularProgressBar Component
 * Displays a skill level as a percentage within a circular progress bar.
 * Includes a simple animation effect on mount to fill the bar.
 *
 * @param {object} props - Component props.
 * @param {string} props.skill - The name of the skill.
 * @param {number} props.percentage - The percentage value for the progress (0-100).
 * @param {string} [props.aos='zoom-in'] - AOS animation type for the container.
 * @param {number} [props.aosDelay=0] - Delay for AOS animation in milliseconds.
 */
const CircularProgressBar = ({
  skill,
  percentage,
  aos = 'zoom-in',
  aosDelay = 0,
  animateOnClick = false,
}) => {
  const CIRCUMFERENCE = 283;
  const safePercentage = Number.isFinite(Number(percentage)) ? Number(percentage) : 0;
  const safeSkill = skill || 'Skill';
  const targetOffset = useMemo(
    () => CIRCUMFERENCE - (safePercentage / 100) * CIRCUMFERENCE,
    [safePercentage]
  );
  const [dashOffset, setDashOffset] = useState(targetOffset);
  const [transitionMs, setTransitionMs] = useState(1200);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setTransitionMs(700);
    setDashOffset(targetOffset);
  }, [targetOffset]);

  const handleActivate = () => {
    if (!animateOnClick) return;
    setIsPressed(true);
    setTransitionMs(0);
    setDashOffset(CIRCUMFERENCE);
    const computedMs = Math.max(300, Math.round((safePercentage / 100) * 3000));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionMs(computedMs);
        setDashOffset(targetOffset);
      });
    });
    setTimeout(() => setIsPressed(false), 220);
  };

  return (
    <div
      className={`circular-progress-bar ${animateOnClick ? 'click-animate' : ''}`}
      data-aos={aos}
      data-aos-delay={aosDelay}
      data-pressed={isPressed ? 'true' : 'false'}
      onClick={handleActivate}
      role={animateOnClick ? 'button' : undefined}
      tabIndex={animateOnClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!animateOnClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleActivate();
        }
      }}
      aria-label={animateOnClick ? `Animate ${safeSkill} skill progress` : undefined}
    >
      <svg className="progress-svg" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="progress-circle-bg"
          cx="50"
          cy="50"
          r="45"
        ></circle>
        {/* Foreground circle (progress) */}
        <circle
          className="progress-circle-fg"
          cx="50"
          cy="50"
          r="45"
          style={{
            strokeDashoffset: dashOffset,
            transition: `stroke-dashoffset ${transitionMs}ms ease-in-out`,
          }}
        ></circle>
      </svg>
      <div className="progress-text-wrapper">
        <span className="progress-percentage">{safePercentage}%</span>
        <span className="skill-name">{safeSkill}</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;