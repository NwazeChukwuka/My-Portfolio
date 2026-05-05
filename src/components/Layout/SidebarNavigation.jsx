/**
 * Sidebar Navigation Component
 * Displays the navigation menu in the sidebar
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export function SidebarNavigation({ 
  navItems = [], 
  isCollapsed, 
  handleLinkClick,
  renderNavItem 
}) {
  return (
    <div className="nav-section">
      <ul className="nav-menu">
        {navItems.map(renderNavItem)}
      </ul>
    </div>
  );
}

/**
 * Sidebar Navigation Item Component
 * Individual navigation item with tooltip support
 */
export function SidebarNavItem({ 
  item, 
  isCollapsed, 
  handleLinkClick 
}) {
  return (
    <li key={item.path} className="nav-item">
      <NavLink
        to={item.path}
        className={({ isActive }) => 
          `nav-link ${isActive ? 'active' : ''}`
        }
        onClick={handleLinkClick}
        title={isCollapsed ? item.name : item.description}
        aria-label={item.name}
        aria-current={({ isActive }) => isActive ? 'page' : undefined}
      >
        <item.icon className="nav-icon" aria-hidden="true" />
        {!isCollapsed && (
          <span className="nav-text">{item.name}</span>
        )}
        {isCollapsed && (
          <div className="nav-tooltip" role="tooltip">
            <span>{item.name}</span>
          </div>
        )}
      </NavLink>
    </li>
  );
}

/**
 * Sidebar Navigation Group Component
 * For navigation items with sub-items
 */
export function SidebarNavGroup({ 
  item, 
  isCollapsed, 
  handleLinkClick 
}) {
  return (
    <li key={item.path} className="nav-item nav-group">
      <div className="nav-link nav-group-toggle">
        <item.icon className="nav-icon" aria-hidden="true" />
        {!isCollapsed && (
          <span className="nav-text">{item.name}</span>
        )}
        {isCollapsed && (
          <div className="nav-tooltip" role="tooltip">
            <span>{item.name}</span>
          </div>
        )}
      </div>
      
      {item.subItems && item.subItems.length > 0 && (
        <ul className="nav-submenu">
          {item.subItems.map((subItem) => (
            <li key={subItem.path} className="nav-subitem">
              <NavLink
                to={subItem.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={handleLinkClick}
                title={isCollapsed ? subItem.name : subItem.description}
                aria-label={subItem.name}
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                <subItem.icon className="nav-icon" aria-hidden="true" />
                {!isCollapsed && (
                  <span className="nav-text">{subItem.name}</span>
                )}
                {isCollapsed && (
                  <div className="nav-tooltip" role="tooltip">
                    <span>{subItem.name}</span>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
