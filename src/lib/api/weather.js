import { dayjs } from '../time/dayjs.js';
import { getCachedData, setCachedData } from './cache.js';
import { fetchJSONWithRetry } from './errors.js';

/**
 * Weather API resource layer
 * Handles fetching, caching, and normalizing weather data from Apple Weather API
 */

const CACHE_KEY_PREFIX = 'weather';

/**
 * Build API URL for weather data
 * @param {string} baseUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} options - Optional query parameters
 * @returns {string} - Complete API URL
 */
const buildWeatherUrl = (baseUrl, lat, lng, options = {}) => {
  const url = new URL(`${baseUrl}/apple-weather/`);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lng', lng);

  if (options.dailyStart) {
    url.searchParams.set('dailyStart', options.dailyStart);
  }
  if (options.dailyEnd) {
    url.searchParams.set('dailyEnd', options.dailyEnd);
  }
  if (options.hourlyStart) {
    url.searchParams.set('hourlyStart', options.hourlyStart);
  }
  if (options.hourlyEnd) {
    url.searchParams.set('hourlyEnd', options.hourlyEnd);
  }

  return url.toString();
};

/**
 * Generate cache key for weather data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} options - Query options
 * @returns {string} - Cache key
 */
const getWeatherCacheKey = (lat, lng, options = {}) => {
  const parts = [CACHE_KEY_PREFIX, lat.toFixed(4), lng.toFixed(4)];
  if (options.dailyStart) {
    parts.push(options.dailyStart);
  }
  return parts.join('_');
};

/**
 * Normalize weather API response
 * @param {Object} response - Raw API response
 * @returns {Object} - Normalized weather data
 */
const normalizeWeatherData = (response) => {
  return {
    weather: response.weather,
    location: response.location,
    timestamp: dayjs().toISOString(),
  };
};

/**
 * Fetch weather data for coordinates
 * @param {string} apiUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} options - Optional parameters
 * @param {boolean} options.forceRefresh - Skip cache and force API call
 * @param {string} options.dailyStart - Daily forecast start date
 * @param {string} options.dailyEnd - Daily forecast end date
 * @param {string} options.hourlyStart - Hourly forecast start date
 * @param {string} options.hourlyEnd - Hourly forecast end date
 * @returns {Promise<Object>} - Weather data with location info
 */
export const fetchWeatherData = async (apiUrl, lat, lng, options = {}) => {
  const cacheKey = getWeatherCacheKey(lat, lng, options);

  // Check cache first unless force refresh
  if (!options.forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const url = buildWeatherUrl(apiUrl, lat, lng, options);
    const data = await fetchJSONWithRetry(url);
    const normalized = normalizeWeatherData(data);

    // Cache the result
    setCachedData(cacheKey, normalized);

    return normalized;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Get current weather and forecasts
 * @param {string} apiUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Current weather and forecast data
 */
export const getCurrentWeather = async (apiUrl, lat, lng) => {
  return fetchWeatherData(apiUrl, lat, lng);
};

/**
 * Get weather for specific date range
 * @param {string} apiUrl - Base API URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Object>} - Weather data for date range
 */
export const getWeatherForDateRange = async (
  apiUrl,
  lat,
  lng,
  startDate,
  endDate
) => {
  return fetchWeatherData(apiUrl, lat, lng, {
    dailyStart: startDate,
    dailyEnd: endDate,
    hourlyStart: startDate,
    hourlyEnd: endDate,
  });
};
