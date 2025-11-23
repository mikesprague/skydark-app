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

export const WeatherMapSmall = ({ OPENWEATHERMAP_API_KEY }) => {
  const radarTileLayerRef = useRef();

  const { weatherData: weather } = useWeatherDataContext();

  const { locationCoordinates, radarMapUrl } = useMemo(() => {
    if (!weather) {
      return { locationCoordinates: null, radarMapUrl: null };
    }

    const coordinates = {
      latitude: weather.currentWeather.metadata.latitude,
      longitude: weather.currentWeather.metadata.longitude,
    };

    let url = null;
    // Set the radar URL from the most recent past data
    if (weather.radarData?.past?.length > 0) {
      const latestRadar =
        weather.radarData.past[weather.radarData.past.length - 1];
      url = `https://tilecache.rainviewer.com${latestRadar.path}/512/{z}/{x}/{y}/8/1_1.png`;
    }

    return { locationCoordinates: coordinates, radarMapUrl: url };
  }, [weather]);

  const mapClickHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModalWithComponent(
        <WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />,
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
    [OPENWEATHERMAP_API_KEY]
  );

  useLayoutEffect(() => {
    if (radarTileLayerRef.current && radarMapUrl) {
      radarTileLayerRef.current.setUrl(radarMapUrl);
    }
  }, [radarMapUrl]);

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
                url={radarMapUrl}
                opacity={0.9}
                ref={radarTileLayerRef}
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
};

export default WeatherMapSmall;
