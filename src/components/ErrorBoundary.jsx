import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    console.error('Route rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="common-section" style={{ textAlign: 'center' }}>
          <h1>Something went wrong on this page</h1>
          <p>{this.state.message}</p>
          <p>Please return home and try again.</p>
          <Link to="/">Go to Home</Link>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
