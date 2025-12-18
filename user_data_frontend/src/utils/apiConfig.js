/**
 * API Configuration Utility
 * 
 * Centralizes API base URL configuration with environment variable support.
 * Falls back to localhost:3001 for development.
 */

// PUBLIC_INTERFACE
/**
 * Get the API base URL from environment variables or use default
 * Supports REACT_APP_API_BASE_URL, REACT_APP_API_BASE, or REACT_APP_BACKEND_URL
 * 
 * @returns {string} The API base URL without trailing slash
 */
export function getApiBaseUrl() {
  const envUrl = 
    process.env.REACT_APP_API_BASE_URL || 
    process.env.REACT_APP_API_BASE || 
    process.env.REACT_APP_BACKEND_URL ||
    'http://localhost:3001';
  
  // Remove trailing slash if present
  return envUrl.replace(/\/$/, '');
}

// PUBLIC_INTERFACE
/**
 * Build a full API endpoint URL
 * 
 * @param {string} path - The API path (e.g., '/api/user-data/')
 * @returns {string} The complete URL
 */
export function buildApiUrl(path) {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// PUBLIC_INTERFACE
/**
 * Standard fetch wrapper with error handling
 * 
 * @param {string} url - The full URL to fetch
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} With user-friendly error message
 */
export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Try to parse response body
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      // Extract error message from response
      let errorMessage = 'Request failed';
      
      if (typeof responseData === 'object') {
        errorMessage = responseData.message || responseData.error || responseData.detail || JSON.stringify(responseData.errors || responseData);
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }
      
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    // Network errors or other failures
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}
