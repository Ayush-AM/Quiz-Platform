import { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showAnimation: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo }, () => {
      // Trigger animation after error is caught
      setTimeout(() => {
        this.setState({ showAnimation: true });
      }, 100);
    });
    
    // Optional: Send to error logging service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <CSSTransition
            in={this.state.showAnimation}
            timeout={500}
            classNames="error-fade"
            appear
          >
            <div className="error-boundary-content">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="error-title">Something went wrong</h2>
              <p className="error-message">We're sorry, but there was an error loading this page.</p>
              
              {this.props.showDetails && (
                <CSSTransition
                  in={this.state.showAnimation}
                  timeout={700}
                  classNames="error-details-fade"
                  appear
                >
                  <details className="error-details">
                    <summary>Error Details</summary>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <div className="stack-trace">
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </div>
                  </details>
                </CSSTransition>
              )}
              
              <div className="error-actions">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="error-action-button"
                >
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="error-action-button secondary"
                >
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                  Reload Page
                </button>
              </div>
            </div>
          </CSSTransition>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  showDetails: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  showDetails: false
};

export default ErrorBoundary;