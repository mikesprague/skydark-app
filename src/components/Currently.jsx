import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import {
  formatCondition,
  openModalWithComponent,
  titleCaseAddSpace,
} from '../modules/helpers.js';
import { getWeatherIcon } from '../modules/icons.js';

import './Currently.css';

export const Currently = () => {
  const { weatherData: weather } = useWeatherDataContext();

  const summary = weather?.currentWeather.conditionCode;

  const clickHandler = useMemo(
    () => () => {
      if (!weather || !summary) {
        return;
      }

      openModalWithComponent(
        <>
          <h3 className="modal-heading" id="modal-headline">
            Current Conditions
          </h3>
          <h4 className="mb-2 text-lg">{titleCaseAddSpace(summary)}</h4>
          <div className="icon">
            <FontAwesomeIcon
              icon={[
                'fad',
                !weather.currentWeather.daylight &&
                getWeatherIcon(weather.currentWeather.conditionCode).nightIcon
                  ? getWeatherIcon(weather.currentWeather.conditionCode)
                      .nightIcon
                  : getWeatherIcon(weather.currentWeather.conditionCode).icon,
              ]}
              style={
                !weather.currentWeather.daylight &&
                getWeatherIcon(weather.currentWeather.conditionCode)
                  .nightIconStyles
                  ? getWeatherIcon(weather.currentWeather.conditionCode)
                      .nightIconStyles
                  : getWeatherIcon(weather.currentWeather.conditionCode)
                      .iconStyles
              }
              fixedWidth
              size="4x"
            />
          </div>
          <div className="flex flex-wrap mt-2">
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'temperature-half']}
                size="2x"
                fixedWidth
                style={{
                  '--fa-primary-color': 'red',
                  '--fa-secondary-color': 'lightgray',
                  '--fa-secondary-opacity': '.9',
                }}
              />
              <br />
              <small>
                Temp:
                {` ${formatCondition(
                  weather.currentWeather.temperature,
                  'temperature'
                )}`}
                <br />
                Feels Like:
                {` ${formatCondition(
                  weather.currentWeather.temperatureApparent,
                  'temperatureApparent'
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
                  weather.currentWeather.windSpeed,
                  'windSpeed'
                )} mph `}
                <FontAwesomeIcon
                  icon={['fad', 'circle-chevron-up']}
                  size="lg"
                  transform={{
                    rotate: weather.currentWeather.windDirection - 180,
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
                  weather.currentWeather.windGust,
                  'windGust'
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
                  weather.currentWeather.humidity,
                  'humidity'
                )}`}
                <br />
                Dew Point:
                {` ${formatCondition(
                  weather.currentWeather.temperatureDewPoint,
                  'temperatureDewPoint'
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
                Precipitation:
                {` ${
                  weather.forecastNextHour.minutes.length
                    ? formatCondition(
                        weather.forecastNextHour.minutes[0].precipitationChance,
                        'precipitationChance'
                      )
                    : 'n/a'
                }`}
                <br />
                Intensity:
                {` ${formatCondition(
                  weather.currentWeather.precipitationIntensity,
                  'precipitationIntensity'
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
                  weather.currentWeather.cloudCover,
                  'cloudCover'
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
                Visibility:
                {` ${formatCondition(
                  weather.currentWeather.visibility,
                  'visibility'
                )} mi`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={[
                  'fad',
                  // eslint-disable-next-line no-nested-ternary
                  weather.currentWeather.pressureTrend === 'steady'
                    ? 'gauge'
                    : weather.currentWeather.pressureTrend === 'rising'
                      ? 'gauge-high'
                      : 'gauge-low',
                ]}
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
                  weather.currentWeather.pressure,
                  'pressure'
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
                {` ${formatCondition(weather.currentWeather.uvIndex, 'uvIndex')}`}
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
                  weather.forecastDaily.days[0].sunrise,
                  'sunrise'
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
                  weather.forecastDaily.days[0].sunset,
                  'sunset'
                ).toLowerCase()}`}
              </small>
            </div>
          </div>
        </>,
        {
          position: 'center',
          padding: '1rem',
        }
      );
    },
    [weather, summary]
  );

  return weather ? (
    <button
      type="button"
      className="current-conditions"
      onClick={clickHandler}
      aria-label="View current weather details"
    >
      <div className="icon">
        <FontAwesomeIcon
          icon={[
            'fad',
            !weather.currentWeather.daylight &&
            getWeatherIcon(weather.currentWeather.conditionCode).nightIcon
              ? getWeatherIcon(weather.currentWeather.conditionCode).nightIcon
              : getWeatherIcon(weather.currentWeather.conditionCode).icon,
          ]}
          style={
            !weather.currentWeather.daylight &&
            getWeatherIcon(weather.currentWeather.conditionCode).nightIconStyles
              ? getWeatherIcon(weather.currentWeather.conditionCode)
                  .nightIconStyles
              : getWeatherIcon(weather.currentWeather.conditionCode).iconStyles
          }
          fixedWidth
          size="4x"
        />
      </div>
      <div className="temperature">
        <h2 className="actual-temp">
          {formatCondition(
            weather.currentWeather.temperature,
            'temperature'
          ).trim()}
        </h2>
        <h3 className="feels-like-temp">{`Feels ${formatCondition(
          weather.currentWeather.temperatureApparent,
          'temperatureApparent'
        ).trim()}`}</h3>
      </div>
    </button>
  ) : (
    ''
  );
};

export default Currently;
