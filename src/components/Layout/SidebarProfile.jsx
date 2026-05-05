/**
 * Sidebar Profile Component
 * Displays user profile information in the sidebar
 * 
 * @typedef {Object} SidebarProfileProps
 * @property {boolean} isCollapsed - Whether sidebar is collapsed
 * @property {Object} general - General user information
 * @property {string} general.fullName - User's full name
 * @property {string} general.tagline - User's professional tagline
 * @property {string} general.secondaryProfilePicture - Profile picture URL
 * @property {Object} contact - Contact information
 * @property {Array} socialLinks - Social media links
 * @property {Function} handleLinkClick - Link click handler
 * @property {string} [className] - Additional CSS classes
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { cn, renderIf } from '../BaseComponent';
import './Sidebar.css';

export function SidebarProfile({ 
  isCollapsed, 
  general = {}, 
  contact = {}, 
  socialLinks = [],
  handleLinkClick,
  className,
  ...props 
}) {
  const profilePic = general.secondaryProfilePicture || '/assets/Me 2.webp';

  return (
    <div 
      className={cn('profile-section', className)}
      {...props}
    >
      <ProfileAvatar
        profilePic={profilePic}
        fullName={general.fullName}
        isCollapsed={isCollapsed}
        handleLinkClick={handleLinkClick}
      />
      
      {renderIf(!isCollapsed, (
        <ProfileDetails
          general={general}
          socialLinks={socialLinks}
        />
      ))}
    </div>
  );
}

/**
 * Profile Avatar Sub-component
 */
function ProfileAvatar({ profilePic, fullName, isCollapsed, handleLinkClick }) {
  return (
    <div className="profile-avatar">
      <NavLink 
        to="/admin/login" 
        className="profile-avatar-link"
        onClick={handleLinkClick}
        title="Open admin login"
        aria-label="Open admin login"
      >
        <ProfileImage
          src={profilePic}
          alt={fullName || 'Profile'}
        />
      </NavLink>
      
      {renderIf(!isCollapsed, (
        <ProfileStatus />
      ))}
    </div>
  );
}

/**
 * Profile Image Sub-component
 */
function ProfileImage({ src, alt }) {
  const handleImageError = (e) => {
    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  };

  return (
    <img
      src={src}
      alt={alt}
      className="profile-pic"
      onError={handleImageError}
    />
  );
}

/**
 * Profile Status Sub-component
 */
function ProfileStatus() {
  return (
    <div className="profile-status" title="Available">
      <div className="status-indicator online" aria-hidden="true"></div>
    </div>
  );
}

/**
 * Profile Details Sub-component
 */
function ProfileDetails({ general, socialLinks }) {
  return (
    <>
      <ProfileInfo general={general} />
      <SocialLinks socialLinks={socialLinks} />
    </>
  );
}

/**
 * Profile Info Sub-component
 */
function ProfileInfo({ general }) {
  return (
    <>
      <h2 className="profile-name">
        {general.fullName || 'Your Name'}
      </h2>
      <p className="profile-title">
        {general.tagline || 'Multidisciplinary Professional'}
      </p>
    </>
  );
}

/**
 * Social Links Sub-component
 */
function SocialLinks({ socialLinks }) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="social-links" role="group" aria-label="Social media links">
      {socialLinks.map((social) => (
        <SocialLink
          key={social.name}
          social={social}
        />
      ))}
    </div>
  );
}

/**
 * Individual Social Link Sub-component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.social - Social link data
 * @param {string} props.social.name - Platform name
 * @param {string} props.social.url - Profile URL
 * @param {React.ComponentType} props.social.icon - Icon component
 * @param {string} props.social.color - Brand color
 */
function SocialLink({ social }) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      aria-label={`Visit ${social.name} profile (opens in new tab)`}
      style={{ '--social-color': social.color }}
    >
      <social.icon aria-hidden="true" />
    </a>
  );
}

// PropTypes definitions
SidebarProfile.propTypes = {
  /** Whether sidebar is collapsed */
  isCollapsed: PropTypes.bool.isRequired,
  /** General user information */
  general: PropTypes.shape({
    fullName: PropTypes.string,
    tagline: PropTypes.string,
    secondaryProfilePicture: PropTypes.string,
  }),
  /** Contact information */
  contact: PropTypes.object,
  /** Social media links */
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  /** Link click handler */
  handleLinkClick: PropTypes.func.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

SocialLink.propTypes = {
  /** Social link data */
  social: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};
