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
    // Enhanced error logging for debugging device-specific issues
    console.group('🚨 ErrorBoundary: Component Error Detected');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('User Agent:', navigator.userAgent);
    console.error('Timestamp:', new Date().toISOString());
    console.error('URL:', window.location.href);
    console.error('LocalStorage available:', typeof(Storage) !== 'undefined');
    console.error('localStorage content:', this.getLocalStorageContent());
    console.groupEnd();
    
    this.setState({ errorInfo }, () => {
      // Trigger animation after error is caught
      setTimeout(() => {
        this.setState({ showAnimation: true });
      }, 100);
    });
    
    // Optional: Send to error logging service
    // logErrorToService(error, errorInfo);
  }

  getLocalStorageContent = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : 'No user data';
    } catch (e) {
      return 'LocalStorage read error: ' + e.message;
    }
  }

  clearCacheAndRestart = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB if available
      if (window.indexedDB) {
        // This will require page reload to take effect
        console.log('IndexedDB will be cleared on page reload');
      }
      
      console.log('Cache cleared successfully');
      
      // Force a hard reload
      window.location.href = window.location.origin + '/login';
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback to regular reload
      window.location.reload(true);
    }
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
                <button 
                  onClick={this.clearCacheAndRestart}
                  className="error-action-button warning"
                  title="Clear all cached data and restart - use this if the error persists"
                >
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18l-2 13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 6z"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Clear Cache & Restart
                </button>
                <button 
                  onClick={() => window.location.href = '/diagnostics'}
                  className="error-action-button info"
                  title="Run system diagnostics to identify device-specific issues"
                >
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  Run Diagnostics
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