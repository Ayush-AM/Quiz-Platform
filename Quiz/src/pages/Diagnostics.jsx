import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeviceInfo, clearAllAppData } from '../utils/deviceCompatibility';
import { getApiUrl } from '../config/api';
import './Diagnostics.css';

export default function Diagnostics() {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [apiTest, setApiTest] = useState({ loading: false, result: null, error: null });

  useEffect(() => {
    // Get device information
    const info = getDeviceInfo();
    setDeviceInfo(info);
    console.log('Device diagnostic info:', info);
  }, []);

  const testApiConnection = async () => {
    setApiTest({ loading: true, result: null, error: null });
    
    try {
      const response = await fetch(getApiUrl('api/auth/test'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiTest({ loading: false, result: data, error: null });
      } else {
        setApiTest({ loading: false, result: null, error: `HTTP ${response.status}: ${response.statusText}` });
      }
    } catch (error) {
      setApiTest({ loading: false, result: null, error: error.message });
    }
  };

  const clearCacheAndData = () => {
    const cleared = clearAllAppData();
    alert(`Cleared: ${cleared.join(', ')}. The page will now reload.`);
    window.location.href = '/login';
  };

  const runFullDiagnostic = () => {
    console.group('🔍 Full Device Diagnostic');
    console.log('Device Info:', deviceInfo);
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
    console.log('Stored User Data:', localStorage.getItem('user'));
    console.log('API Base URL:', getApiUrl(''));
    console.log('Network Status:', navigator.onLine);
    console.groupEnd();
    
    // Test localStorage
    try {
      localStorage.setItem('diagnostic-test', 'test-value');
      const testValue = localStorage.getItem('diagnostic-test');
      console.log('LocalStorage test result:', testValue === 'test-value' ? 'PASS' : 'FAIL');
      localStorage.removeItem('diagnostic-test');
    } catch (e) {
      console.error('LocalStorage test FAILED:', e);
    }
    
    alert('Diagnostic complete. Check the browser console for detailed information.');
  };

  if (!deviceInfo) {
    return <div className="diagnostics-loading">Loading diagnostic information...</div>;
  }

  return (
    <div className="diagnostics-container">
      <h1>System Diagnostics</h1>
      
      <div className="diagnostic-section">
        <h2>Device Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Browser:</label>
            <span>{deviceInfo.isChrome ? 'Chrome' : deviceInfo.isFirefox ? 'Firefox' : deviceInfo.isSafari ? 'Safari' : deviceInfo.isIE ? 'Internet Explorer' : 'Other'}</span>
          </div>
          <div className="info-item">
            <label>Platform:</label>
            <span>{deviceInfo.platform}</span>
          </div>
          <div className="info-item">
            <label>Mobile Device:</label>
            <span>{deviceInfo.isMobile ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-item">
            <label>LocalStorage:</label>
            <span className={deviceInfo.localStorageSupported ? 'status-good' : 'status-bad'}>
              {deviceInfo.localStorageSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>
          <div className="info-item">
            <label>Cookies:</label>
            <span className={deviceInfo.cookiesEnabled ? 'status-good' : 'status-bad'}>
              {deviceInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="info-item">
            <label>Online Status:</label>
            <span className={deviceInfo.onLine ? 'status-good' : 'status-bad'}>
              {deviceInfo.onLine ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {deviceInfo.issues.length > 0 && (
        <div className="diagnostic-section">
          <h2>Detected Issues</h2>
          <div className="issues-list">
            {deviceInfo.issues.map((issue, index) => (
              <div key={index} className="issue-item">
                ⚠️ {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="diagnostic-section">
        <h2>API Connection Test</h2>
        <button onClick={testApiConnection} disabled={apiTest.loading} className="test-button">
          {apiTest.loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        {apiTest.result && (
          <div className="api-result success">
            ✅ API Connection: Success
            <pre>{JSON.stringify(apiTest.result, null, 2)}</pre>
          </div>
        )}
        
        {apiTest.error && (
          <div className="api-result error">
            ❌ API Connection: Failed
            <div>Error: {apiTest.error}</div>
          </div>
        )}
      </div>

      <div className="diagnostic-section">
        <h2>Troubleshooting Actions</h2>
        <div className="action-buttons">
          <button onClick={runFullDiagnostic} className="diagnostic-button">
            Run Full Diagnostic
          </button>
          <button onClick={clearCacheAndData} className="diagnostic-button warning">
            Clear All Data & Restart
          </button>
          <button onClick={() => window.location.reload()} className="diagnostic-button secondary">
            Reload Page
          </button>
        </div>
      </div>

      {user && (
        <div className="diagnostic-section">
          <h2>Current User Data</h2>
          <pre className="user-data">{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
