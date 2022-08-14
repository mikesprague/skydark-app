import { LayersControl, MapContainer, Marker, TileLayer } from 'react-leaflet';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  getRadarTs,
  initLeafletImages,
  openModalWithComponent,
} from '../modules/helpers';
import { isDarkModeEnabled } from '../modules/theme';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { WeatherMapFull } from './WeatherMapFull';

import './WeatherMapSmall.scss';

initLeafletImages(L);

export const WeatherMapSmall = ({ OPENWEATHERMAP_API_KEY }) => {
  const [tsData, setTsData] = useState([getRadarTs()]);

  const mapClickHandler = (e) => {
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
          popup: '',
        },
        hideClass: {
          popup: '',
        },
      },
    );
  };

  useEffect(() => {
    const getTimestamps = async () => {
      await axios
        .get('https://api.rainviewer.com/public/weather-maps.json')
        .then((response) => {
          const nowTs = response.data.radar.past.map((item) => item.time);

          setTsData(nowTs);
        });
    };

    getTimestamps();
  }, []);

  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }

    const coordinates = {
      lat: data.weather.latitude,
      lng: data.weather.longitude,
    };

    setLocationCoordinates(coordinates);
  }, [data]);

  return (
    <div className="small-map-container">
      {locationCoordinates && locationCoordinates.lat ? (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" onClick={mapClickHandler}>
          <MapContainer
            center={[locationCoordinates.lat, locationCoordinates.lng]}
            doubleClickZoom={false}
            dragging={false}
            id="weather-map-small"
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={false}
            zoom={7}
          >
            <Marker
              position={[locationCoordinates.lat, locationCoordinates.lng]}
            />
            <LayersControl position="topright">
              <LayersControl.BaseLayer
                name="Dark"
                checked={isDarkModeEnabled() ? 'checked' : ''}
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
                checked={isDarkModeEnabled() ? '' : 'checked'}
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
                  url={`https://tilecache.rainviewer.com/v2/radar/${
                    tsData[tsData.length - 1]
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
  );
};

WeatherMapSmall.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapSmall;
