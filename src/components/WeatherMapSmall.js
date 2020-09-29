import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
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
    <div className="map">
      {locationCoordinates && locationCoordinates.lat ? (
        <Link to="/map">
          <Map
            center={[locationCoordinates.lat, locationCoordinates.lng]}
            zoom={4}
            doubleClickZoom={false}
            dragging={false}
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={false}
          >
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              opacity={0.95}
            />
            <TileLayer
              url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/256/{z}/{x}/{y}/8/1_1.png`}
              opacity={1}
            />
            <Marker position={[locationCoordinates.lat, locationCoordinates.lng]} opacity={0.85} />
          </Map>
        </Link>
      ) : ''}
    </div>
  );
};

WeatherMapSmall.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
};

export default WeatherMapSmall;
