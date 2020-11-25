import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, WMSTileLayer, LayersControl } from 'react-leaflet';
import { getRadarTs } from '../modules/helpers';
import './WeatherMapSmall.scss';

export const WeatherMapSmall = ({ data }) => {
  const [locationCoordinates, setLocationCoordinates] = useState(null);

  useEffect(() => {
    if (!data) { return; }

    const coordinates = {
      lat: data.latitude,
      lng: data.longitude,
    };

    setLocationCoordinates(coordinates);

    // return () => {};
  }, [data]);

  return (
    <div className="small-map-container">
      {locationCoordinates && locationCoordinates.lat ? (
        <Link to="/map">
          <MapContainer
            center={[locationCoordinates.lat, locationCoordinates.lng]}
            doubleClickZoom={false}
            dragging={false}
            id="weather-map-small"
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={false}
            zoom={5}
          >
            <Marker position={[locationCoordinates.lat, locationCoordinates.lng]} opacity={0.85} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Dark" checked>
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Color">
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Light">
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street (Gray)">
                <TileLayer
                  url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}@2x.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Black/White/Gray">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png"
                  opacity={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Watercolor">
                <TileLayer
                  url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
                  opacity={1}
                  attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Radar" checked>
                <WMSTileLayer
                  url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/512/{z}/{x}/{y}/8/1_1.png`}
                  attribution={'&copy; <a href="https://rainviewer.com/" rel="noopener noreferrer" target="_blank">RainViewer</a>'}
                />
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </Link>
      ) : ''}
    </div>
  );
};

WeatherMapSmall.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
};

export default WeatherMapSmall;
