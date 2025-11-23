import { metricToImperial } from '../../modules/helpers.js';

/**
 * Minimum visual ranges to ensure meaningful differentiation
 * when actual data ranges are too small
 */
export const MIN_VISUAL_RANGES = {
  temperature: 10, // At least 10° F range
  temperatureApparent: 10,
  temperatureDewPoint: 10,
  precipitationChance: 20, // At least 20% range
  precipitationIntensity: 0.1, // At least 0.1 in/hr range
  windSpeed: 5, // At least 5 mph range
  windGust: 5,
  humidity: 15, // At least 15% range
  cloudCover: 20,
  pressure: 10, // At least 10 mb range
  uvIndex: 2, // At least 2 point range
};

/**
 * Convert a raw metric value to imperial units for consistent comparison
 * @param {number} value - The raw value from the API
 * @param {string} condition - The condition type
 * @returns {number} The converted value in imperial units
 */
export function convertToImperial(value, condition) {
  switch (condition) {
    case 'temperature':
    case 'temperatureApparent':
    case 'temperatureDewPoint':
      return metricToImperial.cToF(value);
    case 'windSpeed':
    case 'windGust':
      return metricToImperial.kmToMi(value);
    case 'precipitationIntensity':
      return metricToImperial.mmToIn(value);
    case 'precipitationChance':
    case 'humidity':
    case 'cloudCover':
      return value * 100; // Convert to percentage
    case 'pressure':
    case 'uvIndex':
    default:
      return value;
  }
}

/**
 * Calculate the effective range and max value for visual positioning
 * @param {Array} hourlyData - Array of hourly weather data
 * @param {string} condition - The condition to calculate range for
 * @returns {Object} Object with maxValue, minValue, and effectiveRange
 */
export function calculateConditionRange(hourlyData, condition) {
  if (!hourlyData || !hourlyData.length) {
    return { maxValue: 0, minValue: 0, effectiveRange: 0 };
  }

  // Convert all values to imperial for consistent comparison
  const convertedValues = hourlyData.map((hour) =>
    convertToImperial(hour[condition], condition)
  );

  const max = Math.max(...convertedValues);
  const min = Math.min(...convertedValues);
  const actualRange = max - min;

  // Use minimum visual range if actual range is too small
  const minRange = MIN_VISUAL_RANGES[condition] || 0;
  const effectiveRange = Math.max(actualRange, minRange);

  return {
    maxValue: max,
    minValue: min,
    effectiveRange,
  };
}

/**
 * Calculate the margin-right value for visual positioning
 * @param {number} value - The current hour's value
 * @param {string} condition - The condition type
 * @param {number} maxValue - The maximum value in the range
 * @param {number} effectiveRange - The effective range for positioning
 * @returns {number} The margin-right value in rem units
 */
export function calculateMargin(value, condition, maxValue, effectiveRange) {
  if (effectiveRange === 0) {
    return 0;
  }

  const convertedValue = convertToImperial(value, condition);
  const margin = (maxValue - convertedValue) * (100 / effectiveRange) * 0.05;

  return margin;
}
