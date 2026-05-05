import React from 'react';
import { Link } from 'react-router-dom';
import { errorLogger } from '../lib/errorLogger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Use centralized error logging
    errorLogger.log(error, {
      type: 'react_error_boundary',
      componentStack: errorInfo?.componentStack,
      retryCount: this.state.retryCount,
      errorId: this.state.errorId
    }, 'error');
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleClearErrors = () => {
    errorLogger.clearErrorHistory();
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      const canRetry = this.state.retryCount < 3;

      return (
        <section className="common-section error-boundary-section" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="error-boundary-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>
              🚨 Something went wrong
            </h1>
            
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              We encountered an unexpected error while loading this page. 
              {this.state.retryCount > 0 && ` (Attempt ${this.state.retryCount + 1})`}
            </p>

            {/* Error ID for support */}
            <div style={{ 
              background: 'var(--background-secondary)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              border: `1px solid var(--border-primary)`
            }}>
              <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Error ID:</strong> {this.state.errorId}
              </p>
              {this.state.error?.message && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                  {this.state.error.message}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {canRetry && (
                <button 
                  onClick={this.handleRetry}
                  className="submit-button"
                  style={{ margin: 0 }}
                >
                  🔄 Try Again
                </button>
              )}
              
              <Link to="/" className="submit-button" style={{ margin: 0, textDecoration: 'none' }}>
                🏠 Go to Home
              </Link>
            </div>

            {/* Development details */}
            {isDev && (
              <details style={{ 
                marginTop: '2rem', 
                textAlign: 'left',
                background: 'var(--background-secondary)',
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid var(--border-primary)`
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem' }}>
                  🐛 Development Details
                </summary>
                
                {this.state.error && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4>Error:</h4>
                    <pre style={{ 
                      background: 'var(--background-tertiary)', 
                      padding: '1rem', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '0.85rem',
                      color: 'var(--color-error)'
                    }}>
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                
                {this.state.errorInfo && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4>Component Stack:</h4>
                    <pre style={{ 
                      background: 'var(--background-tertiary)', 
                      padding: '1rem', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '0.85rem'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}

                <button 
                  onClick={this.handleClearErrors}
                  style={{ 
                    background: 'var(--color-error)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Error History
                </button>
              </details>
            )}

            {!canRetry && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: 'var(--background-tertiary)',
                borderRadius: '8px'
              }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  <strong>Maximum retry attempts reached.</strong><br />
                  Please refresh the page or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
