import React, { useEffect, useState } from 'react';
import { Map, Marker, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import { getData } from '../modules/local-storage';
import './WeatherMapFull.scss';

export const WeatherMapFull = (props) => {
  const coordinates = getData('coordinates') || null;

  return (
    <div className="contents">
      <div className="h-full min-h-screen contents v-full">
        <div className="min-h-screen map-container">
          <Map
            center={[coordinates.lat, coordinates.lng]}
            zoom={7}
            doubleClickZoom={true}
            dragging={true}
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.6}
              zIndex={1}
            />
            <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Precipitation" checked>
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Clouds">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Temperature">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Wind Speed">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Sea Level Pressure">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
            </LayersControl>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default WeatherMapFull;
