import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './ErrorTest.css';

// Component that will throw an error when button is clicked
const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error('This is a test error!');
  }
  
  return (
    <div className="buggy-component">
      <h2>Test Component</h2>
      <p>Click the button below to trigger an error and see the ErrorBoundary in action</p>
      <button 
        className="trigger-error-button"
        onClick={() => setShouldThrow(true)}
      >
        Trigger Error
      </button>
    </div>
  );
};

// Wrapper component with ErrorBoundary
const ErrorTest = () => {
  return (
    <div className="error-test-container">
      <h1>Error Boundary Test</h1>
      <div className="test-description">
        <p>This page demonstrates the ErrorBoundary component with modern animations and styling.</p>
      </div>
      
      <ErrorBoundary showDetails={true}>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
};

export default ErrorTest;