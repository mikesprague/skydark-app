import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import './WeatherMapSmall.scss';

export const WeatherMapSmall = memo(({ coordinates, apiKey }) => {
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  useEffect(() => {
    setLocationCoordinates(coordinates);

    return () => {};
  }, [coordinates]);

  const getRadarTs = () => {
    const now = dayjs();
    const hours = now.hour();
    let minutes = dayjs().format('m');
    minutes = minutes - (minutes % 10);
    const millisecondTs = dayjs().hour(hours).minute(minutes).second(0).millisecond(0).valueOf();
    const ts = millisecondTs / 1000;
    // console.log(ts);
    return ts;
  };

  return (
    <div className="map">
    {coordinates && coordinates.lat ? (
      <Link to="/map">
        <Map
          center={[coordinates.lat, coordinates.lng]}
          zoom={4}
          doubleClickZoom={false}
          dragging={false}
          keyboard={false}
          scrollWheelZoom={false}
          touchZoom={false}
        >
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" //https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png, https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            opacity={.85}
          />
          <TileLayer
            url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/256/{z}/{x}/{y}/8/1_1.png`}
            transparent="true"
          />
          <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
        </Map>
      </Link>
      ) : ''}
    </div>
  );
});

export default WeatherMapSmall;
