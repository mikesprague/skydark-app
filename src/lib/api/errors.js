/**
 * Network error handling utilities
 * Provides retry logic and error recovery for API calls
 */

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch with automatic retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} baseDelay - Base delay in ms for exponential backoff (default: 1000)
 * @returns {Promise<Response>} - Fetch response
 * @throws {Error} - If all retries fail
 */
export async function fetchWithRetry(
  url,
  options = {},
  maxRetries = 3,
  baseDelay = 1000
) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (4xx) - these won't succeed on retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(
          `Client error: ${response.status} ${response.statusText}`
        );
      }

      // Retry server errors (5xx) and network errors
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      lastError = error;

      // If this is the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        break;
      }

      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);

      console.warn(
        `Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        error.message
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Fetch JSON with retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Object>} - Parsed JSON response
 */
export async function fetchJSONWithRetry(url, options = {}, maxRetries = 3) {
  const response = await fetchWithRetry(url, options, maxRetries);
  return response.json();
}

/**
 * Check if error is a network error (vs application error)
 * @param {Error} error - Error object
 * @returns {boolean} - True if network-related error
 */
export function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed') ||
    error.message.includes('Server error')
  );
}

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (error.message.includes('Client error')) {
    return 'An error occurred while loading data. Please try again later.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Error recovery helper for weather data
 * Returns cached data if available, null otherwise
 * @param {string} cacheKey - Cache key to check
 * @returns {Object|null} - Cached data or null
 */
export function getFallbackData(cacheKey) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Return even if expired - better than nothing during network failure
      return parsed.data || parsed;
    }
  } catch (error) {
    console.error('Error reading fallback data:', error);
  }
  return null;
}
