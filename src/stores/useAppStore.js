/**
 * App Store - Zustand State Management
 * Manages global application state without breaking existing functionality
 * 
 * @typedef {Object} AppStoreState
 * @property {boolean} isSidebarOpen - Sidebar open state
 * @property {boolean} sidebarCollapsed - Sidebar collapsed state
 * @property {boolean} isMobile - Mobile viewport state
 * @property {() => void} toggleSidebar - Toggle sidebar
 * @property {() => void} closeSidebar - Close sidebar
 * @property {() => void} openSidebar - Open sidebar
 * @property {() => void} toggleSidebarCollapse - Toggle sidebar collapse
 * @property {(isMobile: boolean) => void} setMobile - Set mobile state
 * @property {() => void} resetSidebarState - Reset sidebar state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '../lib/logger';

// Store for sidebar and UI state
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Sidebar state
      isSidebarOpen: false,
      sidebarCollapsed: false,
      
      // UI state
      isMobile: false,
      
      // Actions
      toggleSidebar: () => {
        const currentState = get().isSidebarOpen;
        set({ isSidebarOpen: !currentState });
        logger.debug(`Sidebar toggled: ${!currentState}`);
      },
      
      closeSidebar: () => {
        set({ isSidebarOpen: false });
        logger.debug('Sidebar closed');
      },
      
      openSidebar: () => {
        set({ isSidebarOpen: true });
        logger.debug('Sidebar opened');
      },
      
      toggleSidebarCollapse: () => {
        const { isMobile, sidebarCollapsed } = get();
        if (!isMobile) {
          set({ sidebarCollapsed: !sidebarCollapsed });
          logger.debug(`Sidebar collapse toggled: ${!sidebarCollapsed}`);
        }
      },
      
      setMobile: (isMobile) => {
        const currentState = get().isMobile;
        if (currentState !== isMobile) {
          set({ isMobile });
          // Auto-close sidebar when switching to mobile
          if (isMobile) {
            set({ isSidebarOpen: false });
          }
          logger.debug(`Mobile mode: ${isMobile}`);
        }
      },
      
      // Reset action for testing
      resetSidebarState: () => {
        set({ 
          isSidebarOpen: false, 
          sidebarCollapsed: false,
          isMobile: false 
        });
        logger.debug('Sidebar state reset');
      },
    }),
    {
      name: 'app-store',
      // Only persist sidebar state, not mobile state (derived from viewport)
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        logger.debug('App store rehydrated');
        return state;
      },
    }
  )
);

// Store for loading states
export const useLoadingStore = create((set) => ({
  // Loading states
  isLoading: false,
  loadingMessage: '',
  
  // Actions
  setLoading: (isLoading, message = '') => {
    set({ isLoading, loadingMessage: message });
    if (isLoading) {
      logger.debug(`Loading started: ${message}`);
    } else {
      logger.debug('Loading ended');
    }
  },
  
  startLoading: (message = '') => {
    set({ isLoading: true, loadingMessage: message });
    logger.debug(`Loading started: ${message}`);
  },
  
  stopLoading: () => {
    set({ isLoading: false, loadingMessage: '' });
    logger.debug('Loading stopped');
  },
}));

// Store for notifications/alerts
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  // Actions
  addNotification: (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    logger.info(`Notification added: ${notification.type} - ${notification.message}`);
    
    // Auto-remove notification after timeout
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    logger.debug(`Notification removed: ${id}`);
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
    logger.debug('All notifications cleared');
  },
  
  // Convenience methods
  showSuccess: (message, options = {}) => {
    return get().addNotification({
      type: 'success',
      message,
      ...options,
    });
  },
  
  showError: (message, options = {}) => {
    return get().addNotification({
      type: 'error',
      message,
      duration: 8000, // Errors stay longer
      ...options,
    });
  },
  
  showWarning: (message, options = {}) => {
    return get().addNotification({
      type: 'warning',
      message,
      ...options,
    });
  },
  
  showInfo: (message, options = {}) => {
    return get().addNotification({
      type: 'info',
      message,
      ...options,
    });
  },
}));
