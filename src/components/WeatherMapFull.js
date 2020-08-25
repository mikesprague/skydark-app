import React, { useEffect, useState } from 'react';
import { Map, Marker, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import { getData } from '../modules/local-storage';
import './WeatherMapFull.scss';

export const WeatherMapFull = (props) => {
  const [mapLayerLabel, setMapLayerLabel] = useState('Precipitation');
  const coordinates = getData('coordinates') || null;

  useEffect(() => {


    return () => {};
  }, [mapLayerLabel]);

  const controlEl = Array.from(document.querySelectorAll('.leaflet-control-layers-selector'));
  controlEl.forEach(el => {
    el.addEventListener('click', (event) => {
      setMapLayerLabel(event.target.labels[0].innerText.trim())
    });
  });

  return (
    <div className="contents">
      <div className="header">
        <div className="section-name">
          <h1>{mapLayerLabel}</h1>
        </div>
      </div>
      <div className="h-full min-h-screen contents v-full">
        <div className="min-h-screen map-container">
          <Map
            center={[coordinates.lat, coordinates.lng]}
            zoom={10}
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
            <WMSTileLayer
              layers={['precipitation_new']}
              url={`https://tile.openweathermap.org/map/{layers}/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
              opacity={1}
              zIndex={10}
            />
            <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Precipitation" checked>
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Clouds">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Temperature">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Wind Speed">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Sea Level Pressure">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
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
