import {
  AttributionControl,
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { getRadarTs, initLeafletImages } from '../modules/helpers';
import { getData } from '../modules/local-storage';
import { isDarkModeEnabled } from '../modules/theme';

import './WeatherMapFull.scss';

initLeafletImages(L);

// {/* <TileLayer
// url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
// layers="nexrad-n0q-900913"
// transparent="true"
// /> */}

export const WeatherMapFull = ({ OPENWEATHERMAP_API_KEY }) => {
  const [popupAddress, setPopupAddress] = useState(null);
  const coordinates = getData('coordinates');

  const [tsData, setTsData] = useState([getRadarTs()]);

  useEffect(() => {
    if (!coordinates) {
      window.location.href = '/';
    }

    const getTimestamps = async () => {
      await axios
        .get('https://api.rainviewer.com/public/weather-maps.json')
        .then((response) => {
          const nowTs = response.data.radar.past.map((item) => item.time);

          setTsData(nowTs);
          // console.log(response.data);
          // return response.data;
        });
    };

    const locationData = getData('locationData');

    setPopupAddress(locationData.formattedAddress);
    getTimestamps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ts, setTs] = useState(null);
  const [rangeMax, setRangeMax] = useState(13);
  const [rangeValue, setRangeValue] = useState(13);

  useEffect(() => {
    if (!tsData) {
      return;
    }

    setTs(tsData[tsData.length - 1]);
    setRangeMax(tsData.length - 1);
    setRangeValue(tsData.length - 1);
  }, [tsData]);

  const [radarMapUrl, setRadarMapUrl] = useState(
    `https://tilecache.rainviewer.com/v2/radar/${
      tsData[tsData.length - 1]
    }/512/{z}/{x}/{y}/8/1_1.png`,
  );

  useLayoutEffect(() => {
    if (!ts) {
      return;
    }

    setRadarMapUrl(
      `https://tilecache.rainviewer.com/v2/radar/${ts}/512/{z}/{x}/{y}/8/1_1.png`,
    );
  }, [ts]);

  const radarTileLayerRef = useRef();

  useLayoutEffect(() => {
    if (radarTileLayerRef.current) {
      radarTileLayerRef.current.setUrl(radarMapUrl);
    }
  }, [radarMapUrl]);

  const advanceRangeSlider = useCallback(
    (value) => {
      setTs(tsData[value]);
      setRadarMapUrl(
        `https://tilecache.rainviewer.com/v2/radar/${tsData[value]}/512/{z}/{x}/{y}/8/1_1.png`,
      );
      setRangeValue(value);
    },
    [tsData],
  );

  const rangeSliderHandler = (event) => {
    const { value } = event.target;

    advanceRangeSlider(value);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const timerHandle = useRef();
  const rangeSliderRef = useRef();
  const btnClickHandler = useCallback(() => {
    setIsPlaying((i) => !i);

    if (isPlaying) {
      clearInterval(timerHandle.current);
    } else {
      timerHandle.current = setInterval(() => {
        const currentVal = parseInt(rangeSliderRef.current.value, 10);
        const nextVal = currentVal + 1 > rangeMax ? 0 : currentVal + 1;

        rangeSliderRef.current.value = nextVal;
        advanceRangeSlider(nextVal);
      }, 500);
    }
  }, [advanceRangeSlider, isPlaying, rangeMax]);

  return (
    <>
      <div className="map-container">
        <MapContainer
          animate={true}
          boxZoom={true}
          center={[coordinates.lat, coordinates.lng]}
          doubleClickZoom={true}
          dragging={true}
          className="weather-map-full"
          keyboard={false}
          scrollWheelZoom={false}
          tap={true}
          touchZoom={true}
          zoom={9}
          zoomControl={false}
        >
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>{popupAddress}</Popup>
          </Marker>
          <Circle
            center={[coordinates.lat, coordinates.lng]}
            pathOptions={{ weight: 1, opacity: 0.5 }}
            radius={coordinates.accuracy}
          />
          <ScaleControl position="topleft" />
          <ZoomControl position="topleft" />
          <AttributionControl position="topright" />
          <LayersControl>
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
            <LayersControl.BaseLayer
              name="Color"
              checked={isDarkModeEnabled() ? '' : 'checked'}
            >
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
                opacity={1}
                attribution={
                  '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                }
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Light">
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
            <LayersControl.Overlay name="Radar" checked="checked">
              <TileLayer
                url={`https://tilecache.rainviewer.com/v2/radar/${
                  tsData ? tsData[0] : getRadarTs()
                }/512/{z}/{x}/{y}/8/1_1.png`}
                opacity={0.8}
                attribution={
                  '&copy; <a href="https://www.rainviewer.com/api.html" rel="noopener noreferrer" target="_blank">RainViewer</a>'
                }
                ref={radarTileLayerRef}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Temperature">
              <TileLayer
                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`}
                attribution={
                  '&copy; <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank">OpenWeatherMap</a>'
                }
              />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
      <div className="slider-container">
        {tsData && ts ? (
          <div className="slider">
            <div className="value-label">{dayjs.unix(ts).format('h:mmA')}</div>
            <input
              className="range-slider"
              type="range"
              min={0}
              max={rangeMax}
              step={1}
              value={rangeValue || rangeMax}
              onChange={rangeSliderHandler}
              onInput={rangeSliderHandler}
              ref={rangeSliderRef}
            />
            <button
              type="button"
              className="btn-play-radar-loop"
              onClick={btnClickHandler}
            >
              {isPlaying ? (
                <FontAwesomeIcon icon={['fad', 'stop']} fixedWidth />
              ) : (
                <FontAwesomeIcon icon={['fad', 'play']} fixedWidth />
              )}
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

WeatherMapFull.displayName = 'WeatherMapFull';
WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapFull;
