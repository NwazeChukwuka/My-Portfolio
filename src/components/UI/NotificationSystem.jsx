/**
 * Notification System Component
 * Displays notifications from the Zustand store
 */
import React from 'react';
import { useNotificationStore } from '../../stores/useAppStore';
import './NotificationSystem.css';

export function NotificationSystem() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-system">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function Notification({ notification, onClose }) {
  const { type, message, title } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__content">
        {title && <div className="notification__title">{title}</div>}
        <div className="notification__message">{message}</div>
      </div>
      <button 
        className="notification__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
