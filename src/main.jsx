import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { validateEnvironment } from './lib/envValidation'
import { logger } from './lib/logger'

// Validate environment variables before app starts
try {
  validateEnvironment()
} catch (error) {
  logger.error('Environment validation failed:', error.message)
  // In production, we might want to show an error page
  // For now, we'll try to continue and let the app handle missing variables
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
