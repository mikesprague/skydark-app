import PropTypes from 'prop-types';
import { use, useEffect } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { createWeatherResource } from '../lib/api/resources.js';
import { dayjs } from '../lib/time/dayjs.js';
import { apiUrl } from '../modules/helpers.js';

/**
 * WeatherDataLoader - Fetches weather data using React 19 use() hook
 * Consumes a weather resource and populates the WeatherDataContext
 * Must be wrapped in Suspense boundary
 */
export const WeatherDataLoader = ({ latitude, longitude, children }) => {
  const { setWeatherData, setLocationData, setLastUpdated } =
    useWeatherDataContext();

  // Create weather resource - use() will suspend until data is ready
  const weatherResource = createWeatherResource(apiUrl(), latitude, longitude);

  // Consume the resource with use() hook
  const data = use(weatherResource);

  // Populate context when data is available
  useEffect(() => {
    if (data) {
      setWeatherData(data.weather);
      setLocationData(data.location);
      setLastUpdated(data.timestamp || dayjs().toString());
    }
  }, [data, setWeatherData, setLocationData, setLastUpdated]);

  // Render children once data is loaded
  return children;
};

WeatherDataLoader.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default WeatherDataLoader;
