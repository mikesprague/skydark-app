import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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

  const [tsData, setTsData] = useState(null);

  useEffect(() => {
    const locationData = getData('locationData');
    const { radarData } = getData('weatherData');

    setTsData([...radarData.past, ...radarData.nowcast]);
    setPopupAddress(locationData.formattedAddress);
  }, []);

  const [ts, setTs] = useState(null);
  const [rangeValue, setRangeValue] = useState(null);
  const [rangeMaxValue, setRangeMaxValue] = useState(null);

  useEffect(() => {
    if (!tsData) {
      return;
    }

    setTs(tsData[12]);
    setRangeValue(12);
    setRangeMaxValue(tsData.length - 1);
  }, [tsData]);

  const [radarMapUrl, setRadarMapUrl] = useState(null);

  useLayoutEffect(() => {
    if (!ts) {
      return;
    }

    setRadarMapUrl(
      `https://tilecache.rainviewer.com${ts.path}/512/{z}/{x}/{y}/8/1_1.png`
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
        `https://tilecache.rainviewer.com/${tsData[value].path}/512/{z}/{x}/{y}/8/1_1.png`
      );
      setRangeValue(value);
    },
    [tsData]
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
        const currentVal = Number.parseInt(rangeSliderRef.current.value, 10);
        const nextVal = currentVal === rangeMaxValue ? 0 : currentVal + 1;

        // console.log(currentVal, nextVal);
        rangeSliderRef.current.value = nextVal;
        advanceRangeSlider(nextVal);
      }, 500);
    }
  }, [advanceRangeSlider, isPlaying, rangeMaxValue]);

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
