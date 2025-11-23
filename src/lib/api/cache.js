import { dayjs } from '../time/dayjs.js';

/**
 * Cache utility for managing API response caching
 */

const CACHE_DURATION_MINUTES = 5;

/**
 * Check if cached data has expired
 * @param {string} timestamp - ISO timestamp of when data was cached
 * @param {number} durationMinutes - Cache duration in minutes (default: 5)
 * @returns {boolean} - True if cache has expired
 */
export const isCacheExpired = (
  timestamp,
  durationMinutes = CACHE_DURATION_MINUTES
) => {
  if (!timestamp) {
    return true;
  }

  const nextUpdateTime = dayjs(timestamp).add(durationMinutes, 'minute');
  return dayjs().isAfter(nextUpdateTime);
};

/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data with timestamp, or null if not found/expired
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);

    if (!parsed.timestamp || isCacheExpired(parsed.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
};

/**
 * Set data in cache with timestamp
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    const cacheObject = {
      data,
      timestamp: dayjs().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    console.error(`Error writing cache for ${key}:`, error);
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing cache for ${key}:`, error);
  }
};

/**
 * Clear all app caches
 */
export const clearAllCaches = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};
