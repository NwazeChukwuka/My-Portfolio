/**
 * Compound Components - Advanced Composition Patterns
 * Provides flexible, composable component patterns
 */
import React, { createContext, useContext, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Tab Component - Classic compound component pattern
 */
const TabContext = createContext();

export const Tabs = ({ children, defaultIndex = 0, onIndexChange, className, ...props }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);
  
  const handleTabChange = (index) => {
    setSelectedIndex(index);
    onIndexChange?.(index);
  };
  
  const value = {
    selectedIndex,
    onTabChange: handleTabChange,
  };
  
  return (
    <TabContext.Provider value={value}>
      <div className={cn('tabs', className)} {...props}>
        {children}
      </div>
    </TabContext.Provider>
  );
};

export const TabList = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('tab-list', className)} 
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
});

export const Tab = forwardRef(({ index, children, className, disabled = false, ...props }, ref) => {
  const { selectedIndex, onTabChange } = useContext(TabContext);
  const isSelected = selectedIndex === index;
  
  return (
    <button
      ref={ref}
      className={cn('tab', { 'tab--active': isSelected, 'tab--disabled': disabled }, className)}
      role="tab"
      aria-selected={isSelected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onTabChange(index)}
      {...props}
    >
      {children}
    </button>
  );
});

export const TabPanels = ({ children, className, ...props }) => {
  return (
    <div className={cn('tab-panels', className)} {...props}>
      {children}
    </div>
  );
};

export const TabPanel = ({ index, children, className, ...props }) => {
  const { selectedIndex } = useContext(TabContext);
  const isSelected = selectedIndex === index;
  
  return (
    <div
      className={cn('tab-panel', { 'tab-panel--active': isSelected }, className)}
      role="tabpanel"
      aria-labelledby={`tab-${index}`}
      hidden={!isSelected}
      {...props}
    >
      {isSelected && children}
    </div>
  );
};

/**
 * Accordion Component - Another compound component pattern
 */
const AccordionContext = createContext();

export const Accordion = ({ children, allowMultiple = false, defaultOpen = [], className, ...props }) => {
  const [openItems, setOpenItems] = React.useState(new Set(defaultOpen));
  
  const toggleItem = (value) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else if (allowMultiple) {
        newSet.add(value);
      } else {
        return new Set([value]);
      }
      return newSet;
    });
  };
  
  const isItemOpen = (value) => openItems.has(value);
  
  return (
    <AccordionContext.Provider value={{ toggleItem, isItemOpen, allowMultiple }}>
      <div className={cn('accordion', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ value, children, className, ...props }) => {
  const { isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);
  
  return (
    <div 
      className={cn('accordion-item', { 'accordion-item--open': isOpen }, className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const AccordionTrigger = forwardRef(({ value, children, className, ...props }, ref) => {
  const { toggleItem, isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);
  
  return (
    <button
      ref={ref}
      className={cn('accordion-trigger', { 'accordion-trigger--open': isOpen }, className)}
      aria-expanded={isOpen}
      onClick={() => toggleItem(value)}
      {...props}
    >
      {children}
    </button>
  );
});

export const AccordionContent = ({ value, children, className, ...props }) => {
  const { isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);
  
  return (
    <div 
      className={cn('accordion-content', { 'accordion-content--open': isOpen }, className)}
      hidden={!isOpen}
      {...props}
    >
      <div className="accordion-content-inner">
        {children}
      </div>
    </div>
  );
};

/**
 * Menu Component - Dropdown compound component pattern
 */
const MenuContext = createContext();

export const Menu = ({ children, className, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  
  return (
    <MenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      <div className={cn('menu', className)} {...props}>
        {children}
      </div>
    </MenuContext.Provider>
  );
};

export const MenuTrigger = forwardRef(({ children, className, ...props }, ref) => {
  const { isOpen, toggleMenu } = useContext(MenuContext);
  
  return (
    <button
      ref={ref}
      className={cn('menu-trigger', { 'menu-trigger--open': isOpen }, className)}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={toggleMenu}
      {...props}
    >
      {children}
    </button>
  );
});

export const MenuContent = ({ children, className, ...props }) => {
  const { isOpen, closeMenu } = useContext(MenuContext);
  const menuRef = React.useRef(null);
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeMenu]);
  
  return (
    <div
      ref={menuRef}
      className={cn('menu-content', { 'menu-content--open': isOpen }, className)}
      hidden={!isOpen}
      {...props}
    >
      {children}
    </div>
  );
};

export const MenuItem = forwardRef(({ children, onSelect, className, disabled = false, ...props }, ref) => {
  const { closeMenu } = useContext(MenuContext);
  
  const handleClick = () => {
    if (!disabled) {
      onSelect?.();
      closeMenu();
    }
  };
  
  return (
    <button
      ref={ref}
      className={cn('menu-item', { 'menu-item--disabled': disabled }, className)}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

export const MenuSeparator = ({ className, ...props }) => {
  return (
    <div className={cn('menu-separator', className)} {...props} />
  );
};

/**
 * Card Component - Flexible composition pattern
 */
export const Card = ({ children, className, variant = 'default', elevated = false, ...props }) => {
  const variantClass = `card--${variant}`;
  const elevatedClass = elevated ? 'card--elevated' : '';
  
  return (
    <div 
      className={cn('card', variantClass, elevatedClass, className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-header', className)} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-content', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Modal Component - Advanced composition pattern
 */
const ModalContext = createContext();

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'medium',
  closeOnOverlayClick = true,
  className,
  ...props 
}) => {
  const modalRef = React.useRef(null);
  
  // Focus management
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div 
          ref={modalRef}
          className={cn('modal', `modal--${size}`, className)} 
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export const ModalHeader = ({ children, className, ...props }) => {
  const { onClose } = useContext(ModalContext);
  
  return (
    <div className={cn('modal-header', className)} {...props}>
      {children}
      <button 
        className="modal-close" 
        onClick={onClose}
        aria-label="Close modal"
      >
        ×
      </button>
    </div>
  );
};

export const ModalContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('modal-content', className)} {...props}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn('modal-footer', className)} {...props}>
      {children}
    </div>
  );
};

// Helper function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// PropTypes definitions
Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultIndex: PropTypes.number,
  onIndexChange: PropTypes.func,
  className: PropTypes.string,
};

Tab.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  allowMultiple: PropTypes.bool,
  defaultOpen: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

AccordionTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'borderless']),
  elevated: PropTypes.bool,
};

export default {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
};
