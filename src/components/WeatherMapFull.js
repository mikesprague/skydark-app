import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  MapContainer, Marker, TileLayer, WMSTileLayer, LayersControl, ScaleControl, ZoomControl,
} from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRadarTs } from '../modules/helpers';
import { getData } from '../modules/local-storage';
import './WeatherMapFull.scss';

// {/* <TileLayer
// url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
// layers="nexrad-n0q-900913"
// transparent="true"
// /> */}

export const WeatherMapFull = ({ OPENWEATHERMAP_API_KEY }) => {
  const [mapView, setMapView] = useState(null);
  const coordinates = getData('coordinates') || null;

  useEffect(() => {
    if (!coordinates) {
      window.location.replace('/');
    }

    // return () => {};
  }, [coordinates]);

  const changeHandler = (event) => {
    // console.log(event.target.value);
    setMapView(event.target.value);
  };

  const createdHandler = () => {
    const checkBoxes = Array.from(document.querySelectorAll('.leaflet-control-layers-selector[type=checkbox]'));
    checkBoxes.forEach((cb) => {
      cb.addEventListener('click', (event) => {
        if (event.srcElement.nextSibling.textContent.trim().toLowerCase() === 'temperature' && event.srcElement.checked) {
          setMapView('temp_new');
        } else {
          setMapView(null);
        }
      });
    });
  };

  return (
    <div className="contents">
      <div className="header">
        <div className="section-name">
          <h1>
            <FontAwesomeIcon icon={['fas', 'globe-stand']} className="footer-icon" fixedWidth />
            {' Map'}
          </h1>
        </div>
      </div>
      <div className="h-full min-h-screen contents v-full">
        <div className="relative min-h-screen map-container">
          <MapContainer
            animate={true}
            boxZoom={true}
            center={[coordinates.lat, coordinates.lng]}
            doubleClickZoom={true}
            dragging={true}
            id="weather-map-full"
            keyboard={false}
            whenCreated={createdHandler}
            scrollWheelZoom={false}
            tap={true}
            touchZoom={true}
            zoom={9}
            zoomControl={false}
          >
            <Marker position={[coordinates.lat, coordinates.lng]} opacity={0.9} />
            <ScaleControl position="topleft" />
            <ZoomControl position="topleft" />
            <LayersControl>
              <LayersControl.BaseLayer name="Dark" checked>
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                  opacity={1}
                  zIndex={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Color">
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
                  opacity={1}
                  zIndex={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Light">
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                  opacity={1}
                  zIndex={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={0.8}
                  zIndex={1}
                  attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> contributors'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street (Gray)">
                <TileLayer
                  url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                  opacity={0.8}
                  zIndex={1}
                  attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> contributors'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}@2x.png"
                  opacity={0.9}
                  zIndex={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White/Gray">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png"
                  opacity={0.9}
                  zIndex={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Watercolor">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
                  opacity={0.9}
                  zIndex={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Radar" checked>
                <WMSTileLayer
                  url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/512/{z}/{x}/{y}/8/1_1.png`}
                  opacity={0.75}
                  attribution={'&copy; <a href="https://rainviewer.com/" rel="noopener noreferrer" target="_blank">RainViewer</a>'}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Temperature">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`}
                  opacity={0.85}
                  attribution={'&copy; <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank">OpenWeatherMap</a>'}
                />
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
          <div className="radar-key">
            <img src="/images/radar-key.png" alt="Radar Key" />
          </div>
          <div className={mapView === 'temp_new' ? 'temp-key' : 'hidden'}>
            <img src="/images/temp-key.png" alt="Temperature Key" />
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapFull;
