import L from 'leaflet';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import {
  initLeafletImages,
  openModalWithComponent,
} from '../modules/helpers.js';
import { isDarkModeEnabled } from '../modules/theme.js';

import { WeatherMapFull } from './WeatherMapFull.jsx';

import './WeatherMapSmall.css';

initLeafletImages(L);

export const WeatherMapSmall = ({
  OPENWEATHERMAP_API_KEY,
  RAINBOW_API_TOKEN,
}) => {
  const radarTileLayerRef = useRef();
  const cloudTileLayerRef = useRef();

  const { weatherData: weather } = useWeatherDataContext();

  const { locationCoordinates, radarMapUrl, cloudMapUrl } = useMemo(() => {
    if (!weather) {
      return {
        locationCoordinates: null,
        radarMapUrl: null,
        cloudMapUrl: null,
      };
    }

    const coordinates = {
      latitude: weather.currentWeather.metadata.latitude,
      longitude: weather.currentWeather.metadata.longitude,
    };

    let url = null;
    let cloudsUrl = null;
    // Set the radar URL from the most recent past data
    if (weather.radarData?.snapshot) {
      const { snapshot } = weather.radarData;
      url = `https://api.rainbow.ai/tiles/v1/precip/${snapshot}/0/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}&color=2`;
      cloudsUrl = `https://api.rainbow.ai/tiles/v1/clouds/${snapshot}/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}`;
    }

    return {
      locationCoordinates: coordinates,
      radarMapUrl: url,
      cloudMapUrl: cloudsUrl,
    };
  }, [weather, RAINBOW_API_TOKEN]);

  const mapClickHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModalWithComponent(
        <WeatherMapFull
          OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY}
          RAINBOW_API_TOKEN={RAINBOW_API_TOKEN}
        />,
        {
          didOpen: () => {
            const closeButton = document.querySelector('.swal2-close');

            closeButton.style.position = 'relative';
            closeButton.style.top = '2rem';
            closeButton.style.marginRight = '0.65rem';
            // closeButton.blur();
          },
          showClass: {
            popup: 'animate__animated animate__fadeIn animate__faster',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster',
          },
        }
      );
    },
    [OPENWEATHERMAP_API_KEY, RAINBOW_API_TOKEN]
  );

  useLayoutEffect(() => {
    if (radarTileLayerRef.current && radarMapUrl) {
      radarTileLayerRef.current.setUrl(radarMapUrl);
    }
    if (cloudTileLayerRef.current && cloudMapUrl) {
      cloudTileLayerRef.current.setUrl(cloudMapUrl);
    }
  }, [radarMapUrl, cloudMapUrl]);

  return weather ? (
    <div className="small-map-container">
      {locationCoordinates?.latitude ? (
        <div className="map-wrapper" onClick={mapClickHandler}>
          <MapContainer
            center={[
              locationCoordinates.latitude,
              locationCoordinates.longitude,
            ]}
            doubleClickZoom={false}
            dragging={false}
            id="weather-map-small"
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={false}
            zoom={7}
          >
            <Marker
              position={[
                locationCoordinates.latitude,
                locationCoordinates.longitude,
              ]}
            />
            <TileLayer
              url={
                isDarkModeEnabled()
                  ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                  : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
              }
              attribution={
                '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
              }
            />
            {radarMapUrl && (
              <TileLayer
                maxNativeZoom={12}
                opacity={0.9}
                ref={radarTileLayerRef}
                url={radarMapUrl}
              />
            )}
            {cloudMapUrl && (
              <TileLayer
                maxNativeZoom={7}
                opacity={0.8}
                ref={cloudTileLayerRef}
                url={cloudMapUrl}
              />
            )}
          </MapContainer>
        </div>
      ) : (
        ''
      )}
    </div>
  ) : (
    ''
  );
};

WeatherMapSmall.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
  RAINBOW_API_TOKEN: PropTypes.string.isRequired,
};

export default WeatherMapSmall;
