import { useGeolocation } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import PropTypes from 'prop-types';
import { Suspense, lazy, useCallback, useEffect, useMemo } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
// import utc from 'dayjs/plugin/utc';

import { apiUrl } from '../modules/helpers.js';
import { initIcons } from '../modules/icons.js';
import { isCacheExpired } from '../modules/local-storage.js';

import 'sweetalert2/src/sweetalert2.scss';
import './App.scss';

export const coordinatesAtom = atomWithStorage('coordinates', null);
export const lastUpdatedAtom = atomWithStorage('lastUpdated', null);
export const locationDataAtom = atomWithStorage('locationData', null);
export const weatherDataAtom = atomWithStorage('weatherData', null);

const AirQuality = lazy(() => import('./AirQuality.jsx'));
const CurrentHourly = lazy(() => import('./CurrentHourly.jsx'));
const Currently = lazy(() => import('./Currently.jsx'));
const Daily = lazy(() => import('./Daily.jsx'));
const Header = lazy(() => import('./Header.jsx'));
const LastUpdated = lazy(() => import('./LastUpdated.jsx'));
const LayoutContainer = lazy(() => import('./LayoutContainer.jsx'));
const Loading = lazy(() => import('./Loading.jsx'));
const SunriseSunset = lazy(() => import('./SunriseSunset.jsx'));
const WeatherAlert = lazy(() => import('./WeatherAlert.jsx'));
const WeatherMapSmall = lazy(() => import('./WeatherMapSmall.jsx'));

dayjs.extend(relativeTime);

initIcons();

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);
  const [lastUpdated, setLastUpdated] = useAtom(lastUpdatedAtom);
  const [locationData, setLocationData] = useAtom(locationDataAtom);
  const [weatherData, setWeatherData] = useAtom(weatherDataAtom);

  const geoState = useGeolocation({
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

  const handleGeoChange = useCallback(
    (geo) => {
      if (geo?.latitude && geo?.longitude) {
        const {
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
          timestamp,
          error,
        } = geo;

        if (coordinates?.latitude && coordinates?.longitude) {
          if (
            Number(coordinates.latitude).toFixed(6) === latitude.toFixed(6) &&
            Number(coordinates.longitude).toFixed(6) === longitude.toFixed(6) &&
            !isCacheExpired(coordinates.lastUpdated, 5)
          ) {
            // console.log('same coords in cache ttl, no update');
            return;
          }
        }
        // console.log('handleGeoChange:', geoState);

        setCoordinates({
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
          timestamp,
          error,
          lastUpdated: dayjs().toString(),
        });
      }
    },
    [coordinates, setCoordinates]
  );

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
      const weatherApiUrl = `${apiUrl()}/apple-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await fetch(weatherApiUrl).then((response) =>
        response.json()
      );
      const lastUpdatedString = dayjs().toString();

      setWeatherData(weatherApiData.weather);
      setLocationData(weatherApiData.location);
      setLastUpdated(lastUpdatedString);
    };

    const { latitude, longitude } = coordinates;

    if (weatherData && lastUpdated) {
      if (isCacheExpired(lastUpdated, 5)) {
        getWeatherData(latitude, longitude);
      }
    } else {
      getWeatherData(latitude, longitude);
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
  );
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
