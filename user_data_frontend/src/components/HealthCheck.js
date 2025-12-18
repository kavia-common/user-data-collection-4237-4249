import React, { useState, useEffect } from 'react';
import { buildApiUrl, apiFetch } from '../utils/apiConfig';

const styleVars = {
  banner: {
    width: '100%',
    padding: '10px 20px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 500,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  healthy: {
    background: '#10B981',
    color: '#fff'
  },
  unhealthy: {
    background: '#EF4444',
    color: '#fff'
  },
  checking: {
    background: '#F59E0B',
    color: '#fff'
  }
};

// PUBLIC_INTERFACE
/**
 * Health check component that verifies backend availability on mount.
 * Displays a banner if backend is unreachable.
 */
function HealthCheck() {
  const [status, setStatus] = useState('checking'); // 'checking', 'healthy', 'unhealthy'
  const [message, setMessage] = useState('Checking backend connection...');

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        const url = buildApiUrl('/api/health/');
        await apiFetch(url, { method: 'GET' });
        
        if (isMounted) {
          setStatus('healthy');
          setMessage('Backend connected');
          // Hide success message after 3 seconds
          setTimeout(() => {
            if (isMounted) setStatus(null);
          }, 3000);
        }
      } catch (err) {
        if (isMounted) {
          setStatus('unhealthy');
          const errorMsg = err && err.message ? err.message : 'Backend unavailable';
          setMessage(`⚠️ ${errorMsg}`);
        }
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!status) return null;

  const bannerStyle = {
    ...styleVars.banner,
    ...(status === 'healthy' ? styleVars.healthy : 
        status === 'unhealthy' ? styleVars.unhealthy : 
        styleVars.checking)
  };

  return (
    <div style={bannerStyle} role="alert" aria-live="polite">
      {message}
    </div>
  );
}

export default HealthCheck;
