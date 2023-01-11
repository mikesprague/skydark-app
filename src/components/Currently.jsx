import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  formatCondition,
  openModalWithComponent,
  titleCaseToSentenceCase,
} from '../modules/helpers';
import { getWeatherIcon } from '../modules/icons';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './Currently.scss';

export const Currently = () => {
  const [currentData, setCurrentData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }

    setCurrentData(data.weather);
  }, [data]);

  const clickHandler = () => {
    openModalWithComponent(
      <>
        <h3 className="modal-heading" id="modal-headline">
          Current Conditions
        </h3>
        <h4 className="mb-2 text-lg">
          {titleCaseToSentenceCase(data.weather.currentWeather.conditionCode)}
        </h4>
        <div className="flex flex-wrap mt-2">
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'temperature-half']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'red',
                '--fa-seconday-color': 'lightgray',
                '--fa-secondary-opacity': '.9',
              }}
            />
            <br />
            <small>
              Temp:
              {` ${formatCondition(
                data.weather.currentWeather.temperature,
                'temperature',
              )}`}
              <br />
              Feels Like:
              {` ${formatCondition(
                data.weather.currentWeather.temperatureApparent,
                'temperatureApparent',
              )}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'wind-turbine']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'dodgerblue',
                '--fa-secondary-color': 'silver',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Wind:
              {` ${formatCondition(
                data.weather.currentWeather.windSpeed,
                'windSpeed',
              )} mph `}
              <FontAwesomeIcon
                icon={['fad', 'circle-chevron-up']}
                size="lg"
                transform={{
                  rotate: data.weather.currentWeather.windDirection,
                }}
                style={{
                  '--fa-primary-color': 'ghostwhite',
                  '--fa-secondary-color': 'darkslategray',
                  '--fa-secondary-opacity': '1',
                }}
                fixedWidth
              />
              <br />
              Gusts:
              {` ${formatCondition(
                data.weather.currentWeather.windGust,
                'windGust',
              )} mph`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'droplet-percent']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-primary-color': 'black',
                '--fa-secondary-color': 'deepskyblue',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Humidity:
              {` ${formatCondition(
                data.weather.currentWeather.humidity,
                'humidity',
              )}`}
              <br />
              Dew Point:
              {` ${formatCondition(
                data.weather.currentWeather.temperatureDewPoint,
                'temperatureDewPoint',
              )}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'umbrella']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-primary-color': 'royalblue',
                '--fa-secondary-color': 'sienna',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Precipitaton:
              {` ${formatCondition(
                data.weather.currentWeather.precipitationChance,
                'precipitationChance',
              )}`}
              <br />
              Intensity:
              {` ${formatCondition(
                data.weather.currentWeather.precipitationIntensity,
                'precipitationIntensity',
              )} in/hr`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'clouds']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'darkgray',
                '--fa-secondary-color': 'silver',
                '--fa-secondary-opacity': '1',
              }}
            />
            <br />
            <small>
              Cloud Cover:
              {` ${formatCondition(
                data.weather.currentWeather.cloudCover,
                'cloudCover',
              )}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'eye']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'skyblue',
                '--fa-secondary-color': 'lightgray',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Visibiity:
              {` ${formatCondition(
                data.weather.currentWeather.visibility,
                'visibility',
              )} mi`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'gauge']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'crimson',
                '--fa-secondary-color': 'lightgray',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Pressure:
              {` ${formatCondition(
                data.weather.currentWeather.pressure,
                'pressure',
              )} mb`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'sun']}
              size="2x"
              fixedWidth
              style={{
                '--fa-primary-color': 'gold',
                '--fa-secondary-color': 'darkorange',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              UV Index:
              {` ${formatCondition(
                data.weather.currentWeather.uvIndex,
                'uvIndex',
              )}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'sunrise']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-primary-color': 'darkorange',
                '--fa-secondary-color': 'gold',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Sunrise:
              {` ${formatCondition(
                data.weather.forecastDaily.days[0].sunrise,
                'sunrise',
              ).toLowerCase()}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'sunset']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-primary-color': 'darkorange',
                '--fa-secondary-color': 'gold',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Sunset:
              {` ${formatCondition(
                data.weather.forecastDaily.days[0].sunset,
                'sunset',
              ).toLowerCase()}`}
            </small>
          </div>
        </div>
      </>,
      {
        position: 'center',
        padding: '1rem',
      },
    );
  };

  return currentData ? (
    <div className="current-conditions" onClick={clickHandler}>
      <div className="icon">
        <FontAwesomeIcon
          icon={[
            'fad',
            getWeatherIcon(currentData.currentWeather.conditionCode).icon,
          ]}
          style={
            getWeatherIcon(currentData.currentWeather.conditionCode).iconStyles
          }
          fixedWidth
          size="4x"
        />
      </div>
      <div className="temperature">
        <h2 className="actual-temp">
          {formatCondition(
            currentData.currentWeather.temperature,
            'temperature',
          ).trim()}
        </h2>
        <h3 className="feels-like-temp">{`Feels ${formatCondition(
          currentData.currentWeather.temperatureApparent,
          'temperatureApparent',
        ).trim()}`}</h3>
      </div>
    </div>
  ) : (
    ''
  );
};

export default Currently;
