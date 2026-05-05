/**
 * Type Definitions and JSDoc Types
 * Provides type safety and documentation for the application
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} fullName - User's full name
 * @property {string} tagline - User's professional tagline
 * @property {string} secondaryProfilePicture - Profile picture URL
 */

/**
 * @typedef {Object} Contact
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} linkedin - LinkedIn profile URL
 * @property {string} github - GitHub profile URL
 * @property {string} whatsapp - WhatsApp contact URL
 */

/**
 * @typedef {Object} SocialLink
 * @property {string} name - Social platform name
 * @property {string} url - Profile URL
 * @property {React.ComponentType} icon - Icon component
 * @property {string} color - Brand color
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} name - Display name
 * @property {string} path - Route path
 * @property {React.ComponentType} icon - Icon component
 * @property {string} description - Accessibility description
 * @property {boolean} [isGroup] - Whether this is a group item
 * @property {NavigationItem[]} [items] - Sub-items for groups
 */

/**
 * @typedef {Object} Theme
 * @property {'light'|'dark'} theme - Current theme
 * @property {() => void} toggleTheme - Function to toggle theme
 * @property {(theme: 'light'|'dark') => void} setTheme - Function to set theme
 * @property {boolean} isDark - Whether theme is dark
 * @property {boolean} isLight - Whether theme is light
 */

/**
 * @typedef {Object} AppState
 * @property {boolean} isSidebarOpen - Sidebar open state
 * @property {boolean} sidebarCollapsed - Sidebar collapsed state
 * @property {boolean} isMobile - Mobile viewport state
 * @property {() => void} toggleSidebar - Toggle sidebar
 * @property {() => void} closeSidebar - Close sidebar
 * @property {() => void} toggleSidebarCollapse - Toggle sidebar collapse
 * @property {(isMobile: boolean) => void} setMobile - Set mobile state
 */

/**
 * @typedef {Object} LoadingState
 * @property {boolean} isLoading - Loading state
 * @property {string} loadingMessage - Loading message
 * @property {(isLoading: boolean, message?: string) => void} setLoading - Set loading state
 * @property {(message?: string) => void} startLoading - Start loading
 * @property {() => void} stopLoading - Stop loading
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {'success'|'error'|'warning'|'info'} type - Notification type
 * @property {string} message - Notification message
 * @property {string} [title] - Notification title
 * @property {number} [duration] - Auto-dismiss duration
 * @property {boolean} [autoRemove] - Whether to auto-remove
 */

/**
 * @typedef {Object} NotificationState
 * @property {Notification[]} notifications - Active notifications
 * @property {(notification: Omit<Notification, 'id'>) => string} addNotification - Add notification
 * @property {(id: string) => void} removeNotification - Remove notification
 * @property {() => void} clearNotifications - Clear all notifications
 * @property {(message: string, options?: Object) => string} showSuccess - Show success notification
 * @property {(message: string, options?: Object) => string} showError - Show error notification
 * @property {(message: string, options?: Object) => string} showWarning - Show warning notification
 * @property {(message: string, options?: Object) => string} showInfo - Show info notification
 */

/**
 * @typedef {Object} PortfolioContent
 * @property {User} general - General user information
 * @property {Contact} contact - Contact information
 * @property {Object[]} skills - Skills array
 * @property {Object[]} experience - Experience array
 * @property {Object[]} education - Education array
 * @property {Object[]} projects - Projects array
 */

/**
 * @typedef {Object} ComponentProps
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Child components
 * @property {string} [id] - Element ID
 * @property {string} ['aria-label'] - ARIA label
 * @property {string} ['aria-describedby'] - ARIA describedby
 * @property {string} [role] - ARIA role
 */

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {() => void} [onClick] - Click handler
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [loading] - Loading state
 * @property {'button'|'submit'|'reset'} [type] - Button type
 * @property {'primary'|'secondary'|'danger'|'success'} [variant] - Button variant
 * @property {'small'|'medium'|'large'} [size] - Button size
 */

/**
 * @typedef {Object} FormFieldProps
 * @property {string} label - Field label
 * @property {string} [name] - Field name
 * @property {string} [id] - Field ID
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [value] - Field value
 * @property {(value: string) => void} [onChange] - Change handler
 * @property {string} [error] - Error message
 * @property {boolean} [required] - Required field
 * @property {string} [description] - Field description
 * @property {React.ReactNode} [children] - Field input
 */

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Modal open state
 * @property {() => void} onClose - Close handler
 * @property {React.ReactNode} children - Modal content
 * @property {'small'|'medium'|'large'|'fullscreen'} [size] - Modal size
 * @property {boolean} [closeOnOverlayClick] - Close on overlay click
 * @property {string} [title] - Modal title
 */

/**
 * @typedef {Object} CardProps
 * @property {React.ReactNode} [header] - Card header
 * @property {React.ReactNode} [footer] - Card footer
 * @property {React.ReactNode} children - Card content
 * @property {'default'|'elevated'|'outlined'|'borderless'} [variant] - Card variant
 * @property {boolean} [elevated] - Elevated shadow
 */

/**
 * @typedef {Object} ListProps
 * @property {Array<any>} items - List items
 * @property {(item: any, index: number) => React.ReactNode} renderItem - Render function
 * @property {(item: any, index: number) => string} [keyExtractor] - Key extractor
 * @property {React.ReactNode} [emptyState] - Empty state component
 * @property {boolean} [loading] - Loading state
 * @property {React.ReactNode} [loadingState] - Loading state component
 */

/**
 * @typedef {Object} Breakpoints
 * @property {number} xs - Extra small screens (0px and up)
 * @property {number} sm - Small screens (576px and up)
 * @property {number} md - Medium screens (768px and up)
 * @property {number} lg - Large screens (992px and up)
 * @property {number} xl - Extra large screens (1200px and up)
 * @property {number} xxl - Extra extra large screens (1400px and up)
 */

/**
 * @typedef {Object} SpacingScale
 * @property {string} xs - Extra small spacing
 * @property {string} sm - Small spacing
 * @property {string} md - Medium spacing
 * @property {string} lg - Large spacing
 * @property {string} xl - Extra large spacing
 * @property {string} '2xl' - Extra extra large spacing
 * @property {string} '3xl' - Extra extra extra large spacing
 */

/**
 * @typedef {Object} ColorPalette
 * @property {string} primary - Primary color
 * @property {string} secondary - Secondary color
 * @property {string} success - Success color
 * @property {string} warning - Warning color
 * @property {string} error - Error color
 * @property {string} info - Info color
 */

/**
 * @typedef {Object} TypographyScale
 * @property {string} xs - Extra small font size
 * @property {string} sm - Small font size
 * @property {string} base - Base font size
 * @property {string} lg - Large font size
 * @property {string} xl - Extra large font size
 * @property {string} '2xl' - Extra extra large font size
 * @property {string} '3xl' - Extra extra extra large font size
 * @property {string} '4xl' - Extra extra extra extra large font size
 */

/**
 * @typedef {Object} AnimationDuration
 * @property {string} fast - Fast animation (150ms)
 * @property {string} normal - Normal animation (300ms)
 * @property {string} slow - Slow animation (500ms)
 */

/**
 * @typedef {Object} ShadowScale
 * @property {string} none - No shadow
 * @property {string} sm - Small shadow
 * @property {string} md - Medium shadow
 * @property {string} lg - Large shadow
 * @property {string} xl - Extra large shadow
 * @property {string} '2xl' - Extra extra large shadow
 */

// Export types for use in other files
export {
  User,
  Contact,
  SocialLink,
  NavigationItem,
  Theme,
  AppState,
  LoadingState,
  Notification,
  NotificationState,
  PortfolioContent,
  ComponentProps,
  ButtonProps,
  FormFieldProps,
  ModalProps,
  CardProps,
  ListProps,
  Breakpoints,
  SpacingScale,
  ColorPalette,
  TypographyScale,
  AnimationDuration,
  ShadowScale,
};
