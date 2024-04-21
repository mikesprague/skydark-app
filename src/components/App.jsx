import axios from 'axios';
import useGeolocation from 'beautiful-react-hooks/useGeolocation';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Suspense, lazy, useEffect, useMemo } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
// import utc from 'dayjs/plugin/utc';

import { apiUrl } from '../modules/helpers';
import { initIcons } from '../modules/icons';
import { isCacheExpired } from '../modules/local-storage';

import { useWeatherDataContext, useWeatherDataUpdaterContext  } from '../contexts/WeatherDataContext';

import 'sweetalert2/src/sweetalert2.scss';
import './App.scss';

const AirQuality = lazy(() => import('./AirQuality'));
const CurrentHourly = lazy(() => import('./CurrentHourly'));
const Currently = lazy(() => import('./Currently'));
const Daily = lazy(() => import('./Daily'));
const Header = lazy(() => import('./Header'));
const LastUpdated = lazy(() => import('./LastUpdated'));
const LayoutContainer = lazy(() => import('./LayoutContainer'));
const Loading = lazy(() => import('./Loading'));
const SunriseSunset = lazy(() => import('./SunriseSunset'));
const WeatherAlert = lazy(() => import('./WeatherAlert'));
const WeatherMapSmall = lazy(() => import('./WeatherMapSmall'));

dayjs.extend(relativeTime);

initIcons();

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  const {
    coordinates,
    lastUpdated,
    locationData,
    weatherData,
  } = useWeatherDataContext();

  const {
    setCoordinates,
    setLastUpdated,
    setLocationData,
    setWeatherData,
  } = useWeatherDataUpdaterContext();

  const [geoState] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3600000,
  });

  // clean up old localStorage data
  useEffect(() => {
    const items = { ...localStorage };
    const hourlyItems = Object.keys(items).filter((key) =>
      key.includes('hourlyData_')
    );
    for (const hourlyItem of hourlyItems) {
      const datePart = hourlyItem.split('_')[1];
      const date = dayjs.unix(datePart);
      if (date.isBefore(dayjs())) {
        localStorage.removeItem(hourlyItem);
      }
    }
  }, []);

  // geoState.onError,
  // geoState.isSupported,
  // geoState.isRetrieving,
  // geoState.position

  const handleGeoChange = (geo) => {
    if (geo?.position?.coords) {
      const { latitude, longitude, accuracy } = geo.position.coords;

      if (coordinates?.lat && coordinates?.lng) {
        if (
          Number(coordinates.lat).toFixed(6) === latitude.toFixed(6) &&
          Number(coordinates.lng).toFixed(6) === longitude.toFixed(6) &&
          !isCacheExpired(coordinates.lastUpdated, 5)
        ) {
          // console.log('same coords in cache ttl, no update');
          return;
        }
      }
      // console.log('handleGeoChange:', geoState);

      setCoordinates({
        lat: latitude,
        lng: longitude,
        accuracy,
        lastUpdated: dayjs().toString(),
      });
    }
  };

  useEffect(() => {
    if (coordinates && !isCacheExpired(coordinates.lastUpdated, 5)) {
      return;
    }

    handleGeoChange(geoState);
  }, [coordinates, geoState, handleGeoChange]);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const getWeatherData = async (latitude, longitude) => {
      const weatherApiurl = `${apiUrl()}/apple-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await axios
        .get(weatherApiurl)
        .then((response) => response.data);
      const lastUpdatedString = dayjs().toString();

      setWeatherData(weatherApiData.weather);
      setLocationData(weatherApiData.location);
      setLastUpdated(lastUpdatedString);
    };

    const { lat, lng } = coordinates;

    if (weatherData && lastUpdated) {
      if (isCacheExpired(lastUpdated, 5)) {
        getWeatherData(lat, lng);
      }
    } else {
      getWeatherData(lat, lng);
    }
  }, [
    coordinates,
    lastUpdated,
    weatherData,
    setWeatherData,
    setLastUpdated,
    setLocationData,
  ]);

  const _returnData = useMemo(
    () => ({
      weather: weatherData,
      location: locationData,
      lastUpdated,
    }),
    [lastUpdated, locationData, weatherData]
  );

  return weatherData && locationData ? (
    <Suspense fallback={<Loading fullHeight={true} />}>
        <Header OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
        <LayoutContainer>
          <Currently />
          <AirQuality />
          <WeatherAlert />
          <WeatherMapSmall OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
          <CurrentHourly />
          <SunriseSunset />
          <Daily />
          <LastUpdated />
        </LayoutContainer>
    </Suspense>
  ) : (
    <Loading fullHeight={true} />
  )
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
