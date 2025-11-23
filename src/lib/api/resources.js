import { getCachedData, setCachedData } from './cache.js';
import { fetchWeatherData } from './weather.js';

/**
 * React 19 resource layer for use() hook consumption
 * Resources are promises that can be consumed by React's use() hook within Suspense boundaries
 */

/**
 * Resource cache to prevent duplicate requests for same data
 * Maps cache keys to in-flight promises
 */
const resourceCache = new Map();

/**
 * Create a weather data resource that can be consumed with use()
 * @param {string} apiUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} options - Fetch options
 * @returns {Promise} - Weather data promise for use() hook
 */
export const createWeatherResource = (apiUrl, lat, lng, options = {}) => {
  const cacheKey = `weather_${lat.toFixed(4)}_${lng.toFixed(4)}`;

  // Check cache first (unless force refresh)
  if (!options.forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      // Return resolved promise for cached data
      return Promise.resolve(cached);
    }

    // Check if we already have an in-flight request
    if (resourceCache.has(cacheKey)) {
      return resourceCache.get(cacheKey);
    }
  }

  // Create new fetch promise
  const promise = fetchWeatherData(apiUrl, lat, lng, options)
    .then((data) => {
      // Don't cache here - fetchWeatherData already handles caching
      // Clean up resource cache
      resourceCache.delete(cacheKey);
      return data;
    })
    .catch((error) => {
      // Clean up resource cache on error
      resourceCache.delete(cacheKey);
      throw error;
    });

  // Store in-flight promise to prevent duplicate requests
  resourceCache.set(cacheKey, promise);

  return promise;
};

/**
 * Create a daily weather resource for a specific date
 * @param {string} apiUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} date - ISO date string
 * @returns {Promise} - Daily weather data promise
 */
export const createDailyWeatherResource = (apiUrl, lat, lng, date) => {
  const cacheKey = `daily_${lat.toFixed(4)}_${lng.toFixed(4)}_${date}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  // Check for in-flight request
  if (resourceCache.has(cacheKey)) {
    return resourceCache.get(cacheKey);
  }

  const promise = fetchWeatherData(apiUrl, lat, lng, {
    dailyStart: date,
    hourlyStart: date,
  })
    .then((data) => {
      setCachedData(cacheKey, data);
      resourceCache.delete(cacheKey);
      return data;
    })
    .catch((error) => {
      resourceCache.delete(cacheKey);
      throw error;
    });

  resourceCache.set(cacheKey, promise);
  return promise;
};

/**
 * Clear all resource caches
 * Useful for force refresh scenarios
 */
export const clearResourceCache = () => {
  resourceCache.clear();
};
