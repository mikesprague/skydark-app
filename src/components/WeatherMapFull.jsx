import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
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

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { initLeafletImages } from '../modules/helpers';
import { isDarkModeEnabled } from '../modules/theme';

import './WeatherMapFull.scss';

import { coordinatesAtom, locationDataAtom, weatherDataAtom } from './App';

initLeafletImages(L);

// {/* <TileLayer
// url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
// layers="nexrad-n0q-900913"
// transparent="true"
// /> */}

const popupAddressAtom = atom(null);
const tsDataAtom = atom(null);
const tsAtom = atom(null);
const rangeValueAtom = atom(null);
const rangeMaxValueAtom = atom(null);
const radarMapUrlAtom = atom(null);
const isPlayingAtom = atom(false);

export const WeatherMapFull = ({ OPENWEATHERMAP_API_KEY }) => {
  const timerHandle = useRef();
  const rangeSliderRef = useRef();

  const [popupAddress, setPopupAddress] = useAtom(popupAddressAtom);
  const [tsData, setTsData] = useAtom(tsDataAtom);
  const [ts, setTs] = useAtom(tsAtom);
  const [rangeValue, setRangeValue] = useAtom(rangeValueAtom);
  const [rangeMaxValue, setRangeMaxValue] = useAtom(rangeMaxValueAtom);
  const [radarMapUrl, setRadarMapUrl] = useAtom(radarMapUrlAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  const coordinates = useAtomValue(coordinatesAtom);
  const locationData = useAtomValue(locationDataAtom);
  const weatherData = useAtomValue(weatherDataAtom);
  const { radarData } = weatherData;

  useEffect(() => {
    setTsData([...radarData.past, ...radarData.nowcast]);
    setPopupAddress(locationData.formattedAddress);
  }, [locationData, radarData, setPopupAddress, setTsData]);

  useEffect(() => {
    if (!tsData) {
      return;
    }

    setTs(tsData[12]);
    setRangeValue(12);
    setRangeMaxValue(tsData.length - 1);
  }, [setRangeMaxValue, setRangeValue, setTs, tsData]);

  useLayoutEffect(() => {
    if (!ts) {
      return;
    }

    setRadarMapUrl(
      `https://tilecache.rainviewer.com${ts.path}/512/{z}/{x}/{y}/8/1_1.png`
    );
  }, [setRadarMapUrl, ts]);

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
        `https://tilecache.rainviewer.com/${tsData[value].path}/512/{z}/{x}/{y}/8/1_1.png`
      );
      setRangeValue(value);
    },
    [setRadarMapUrl, setRangeValue, setTs, tsData]
  );

  const rangeSliderHandler = (event) => {
    const { value } = event.target;

    advanceRangeSlider(value);
  };

  const btnClickHandler = useCallback(() => {
    setIsPlaying((i) => !i);

    if (isPlaying) {
      clearInterval(timerHandle.current);
    } else {
      timerHandle.current = setInterval(() => {
        const currentVal = Number.parseInt(rangeSliderRef.current.value, 10);
        const nextVal = currentVal === rangeMaxValue ? 0 : currentVal + 1;

        // console.log(currentVal, nextVal);
        rangeSliderRef.current.value = nextVal;
        advanceRangeSlider(nextVal);
      }, 500);
    }
  }, [advanceRangeSlider, isPlaying, rangeMaxValue, setIsPlaying]);

  return tsData && ts ? (
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
                url={`https://tilecache.rainviewer.com/v2/radar${tsData[0]}/512/{z}/{x}/{y}/8/1_1.png`}
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
            <div className="value-label">
              {dayjs.unix(ts.time).format('h:mmA')}
            </div>
            <input
              className="range-slider"
              type="range"
              min={0}
              max={rangeMaxValue}
              step={1}
              value={rangeValue}
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
  ) : (
    ''
  );
};

WeatherMapFull.displayName = 'WeatherMapFull';
WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapFull;
