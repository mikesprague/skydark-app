import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { LayersControl, MapContainer, Marker, TileLayer } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  initLeafletImages,
  openModalWithComponent,
} from '../modules/helpers.js';
import { isDarkModeEnabled } from '../modules/theme.js';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import { WeatherMapFull } from './WeatherMapFull.jsx';

import './WeatherMapSmall.css';

initLeafletImages(L);

export const WeatherMapSmall = ({ OPENWEATHERMAP_API_KEY }) => {
  const [locationCoordinates, setLocationCoordinates] = useState(null);

  const { weatherData: weather } = useWeatherDataContext();

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

  useEffect(() => {
    if (!weather) {
      return;
    }

    const coordinates = {
      latitude: weather.currentWeather.metadata.latitude,
      longitude: weather.currentWeather.metadata.longitude,
    };

    setLocationCoordinates(coordinates);
  }, [weather]);

  return weather ? (
    <div className="small-map-container">
      {locationCoordinates?.latitude ? (
        // biome-ignore lint/a11y/useValidAnchor: linking the map, button not appropriate
        <a href="#" onClick={mapClickHandler}>
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
            <LayersControl position="topright">
              <LayersControl.BaseLayer
                name="Dark"
                checked={isDarkModeEnabled()}
              >
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Color">
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_all/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer
                name="Light"
                checked={!isDarkModeEnabled()}
              >
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street (Gray)">
                <TileLayer
                  url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}@2x.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White/Gray">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Watercolor">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
                  opacity={1}
                  attribution={
                    '&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Radar" checked>
                <TileLayer
                  url={`https://tilecache.rainviewer.com/${
                    weather.radarData.past[weather.radarData.past.length - 1]
                      .path
                  }/512/{z}/{x}/{y}/8/1_1.png`}
                  opacity={0.9}
                  attribution={
                    '&copy; <a href="https://rainviewer.com/" rel="noopener noreferrer" target="_blank">RainViewer</a>'
                  }
                />
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </a>
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
