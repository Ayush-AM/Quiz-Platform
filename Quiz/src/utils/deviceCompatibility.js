/**
 * Device compatibility utilities to handle device-specific issues
 */

/**
 * Detect common device/browser issues
 * @returns {Object} Object containing compatibility information and issues
 */
export const checkDeviceCompatibility = () => {
  const issues = [];
  const info = {
    userAgent: navigator.userAgent,
    isIE: false,
    isEdgeLegacy: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isMobile: false,
    localStorageSupported: false,
    cookiesEnabled: false,
    javascriptEnabled: true
  };

  // Browser detection
  if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
    info.isIE = true;
    issues.push('Internet Explorer is not fully supported. Please use a modern browser.');
  }
  
  if (navigator.userAgent.indexOf('Edge') !== -1 && navigator.userAgent.indexOf('Chromium') === -1) {
    info.isEdgeLegacy = true;
    issues.push('Legacy Edge detected. Please update to the new Edge browser.');
  }
  
  if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
    info.isSafari = true;
  }
  
  if (navigator.userAgent.indexOf('Chrome') !== -1) {
    info.isChrome = true;
  }
  
  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    info.isFirefox = true;
  }

  // Mobile detection
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    info.isMobile = true;
  }

  // LocalStorage support
  try {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      info.localStorageSupported = true;
    } else {
      issues.push('LocalStorage is not supported on this device.');
    }
  } catch (e) {
    issues.push('LocalStorage is disabled or not available: ' + e.message);
  }

  // Cookie support
  try {
    document.cookie = 'testcookie=1; path=/';
    if (document.cookie.indexOf('testcookie=') !== -1) {
      info.cookiesEnabled = true;
      // Clean up test cookie
      document.cookie = 'testcookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } else {
      issues.push('Cookies are disabled. Some features may not work properly.');
    }
  } catch (e) {
    issues.push('Cookie support could not be verified: ' + e.message);
  }

  return { info, issues };
};

/**
 * Clear all app-related data from the device
 */
export const clearAllAppData = () => {
  const clearedItems = [];
  
  try {
    // Clear localStorage
    localStorage.clear();
    clearedItems.push('localStorage');
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }

  try {
    // Clear sessionStorage
    sessionStorage.clear();
    clearedItems.push('sessionStorage');
  } catch (e) {
    console.error('Failed to clear sessionStorage:', e);
  }

  try {
    // Clear cookies (app-related ones)
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      // Clear cookie by setting expiry date to past
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    clearedItems.push('cookies');
  } catch (e) {
    console.error('Failed to clear cookies:', e);
  }

  return clearedItems;
};

/**
 * Get detailed device information for debugging
 */
export const getDeviceInfo = () => {
  const compatibility = checkDeviceCompatibility();
  
  return {
    ...compatibility.info,
    issues: compatibility.issues,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled
  };
};
