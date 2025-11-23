import PropTypes from 'prop-types';
import { lazy, Suspense, useCallback, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';
import { initIcons } from '../modules/icons.js';
import { isCacheExpired } from '../modules/local-storage.js';

import { ErrorBoundary } from './ErrorBoundary.jsx';

import 'sweetalert2/dist/sweetalert2.css';
import './App.css';

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
const WeatherDataLoader = lazy(() => import('./WeatherDataLoader.jsx'));
const WeatherMapSmall = lazy(() => import('./WeatherMapSmall.jsx'));

initIcons();

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  const { setCoordinates, coordinates } = useWeatherDataContext();

  const geoState = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 3600000,
      timeout: Number.POSITIVE_INFINITY,
    },
    watchPosition: false,
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
      if (geo?.coords?.latitude && geo?.coords?.longitude) {
        const {
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
        } = geo.coords;
        const {
          timestamp,
          positionError,
          // getPosition,
          isGeolocationAvailable,
          isGeolocationEnabled,
        } = geo;

        if (coordinates?.latitude && coordinates?.longitude) {
          if (
            Number(coordinates.latitude).toFixed(6) === latitude.toFixed(6) &&
            Number(coordinates.longitude).toFixed(6) === longitude.toFixed(6) &&
            !isCacheExpired(coordinates.lastUpdated, 5)
          ) {
            return;
          }
        }

        setCoordinates({
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
          timestamp,
          positionError,
          isGeolocationAvailable,
          isGeolocationEnabled,
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

  // Show loading while waiting for coordinates
  if (!coordinates) {
    return <Loading fullHeight={true} />;
  }

  const { latitude, longitude } = coordinates;

  // Render app with WeatherDataLoader using use() hook pattern
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading fullHeight={true} />}>
        <WeatherDataLoader latitude={latitude} longitude={longitude}>
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
        </WeatherDataLoader>
      </Suspense>
    </ErrorBoundary>
  );
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
