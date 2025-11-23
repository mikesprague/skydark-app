import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import { calculateMargin } from '../lib/conditions/ranges.js';
import { dayjs } from '../lib/time/dayjs.js';

import {
  formatCondition,
  getConditionBarClass,
  getUvIndexClasses,
  openModalWithComponent,
  titleCaseAddSpace,
} from '../modules/helpers.js';

import { getWeatherIcon } from '../modules/icons.js';

import './Hour.css';

export const Hour = ({
  data,
  dayData,
  summary,
  isFirst,
  isLast,
  conditionToShow,
  valueRange,
  maxValue,
}) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] =
    useState('temperature');

  useEffect(() => {
    setHourlyConditionToShow(conditionToShow);
  }, [conditionToShow]);

  const clickHandler = useMemo(
    () => () => {
      openModalWithComponent(
        <>
          <h3 className="modal-heading" id="modal-headline">
            {`${dayjs(data.forecastStart).format('ddd, MMMM D')} at ${dayjs(
              data.forecastStart
            ).format('h:mm A')}`}
          </h3>
          <h4 className="mb-2 text-lg">
            {titleCaseAddSpace(data.conditionCode)}
          </h4>
          <div className="my-1">
            <FontAwesomeIcon
              icon={[
                'fad',
                !data.daylight && getWeatherIcon(data.conditionCode).nightIcon
                  ? getWeatherIcon(data.conditionCode).nightIcon
                  : getWeatherIcon(data.conditionCode).icon,
              ]}
              style={
                !data.daylight &&
                getWeatherIcon(data.conditionCode).nightIconStyles
                  ? getWeatherIcon(data.conditionCode).nightIconStyles
                  : getWeatherIcon(data.conditionCode).iconStyles
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
                {` ${formatCondition(data.temperature, 'temperature')}`}
                <br />
                Feels Like:
                {` ${formatCondition(
                  data.temperatureApparent,
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
                {` ${formatCondition(data.windSpeed, 'windSpeed')} mph `}
                <FontAwesomeIcon
                  icon={['fad', 'circle-chevron-up']}
                  size="lg"
                  transform={{ rotate: data.windDirection - 180 }}
                  style={{
                    '--fa-primary-color': 'ghostwhite',
                    '--fa-secondary-color': 'darkslategray',
                    '--fa-secondary-opacity': '1',
                  }}
                  fixedWidth
                />
                <br />
                Gusts:
                {` ${formatCondition(data.windGust, 'windGust')} mph`}
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
                {` ${formatCondition(data.humidity, 'humidity')}`}
                <br />
                Dew Point:
                {` ${formatCondition(
                  data.temperatureDewPoint,
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
                {` ${formatCondition(
                  data.precipitationChance,
                  'precipitationChance'
                )}`}
                <br />
                Intensity:
                {` ${formatCondition(
                  data.precipitationIntensity,
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
                {` ${formatCondition(data.cloudCover, 'cloudCover')}`}
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
                {` ${formatCondition(data.visibility, 'visibility')} mi`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={[
                  'fad',
                  // eslint-disable-next-line no-nested-ternary
                  data.pressureTrend === 'steady'
                    ? 'gauge'
                    : data.pressureTrend === 'rising'
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
                {` ${formatCondition(data.pressure, 'pressure')} mb`}
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
                {` ${formatCondition(data.uvIndex, 'uvIndex')}`}
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
                {` ${formatCondition(dayData.sunrise, 'sunrise').toLowerCase()}`}
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
                {` ${formatCondition(dayData.sunset, 'sunset').toLowerCase()}`}
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
    [data, dayData]
  );

  return (
    <li className="hour">
      <div className="hour-wrap">
        <div
          className={`condition-bar ${isLast ? 'rounded-b-md' : ''} ${
            isFirst ? 'rounded-t-md' : ''
          } ${getConditionBarClass(data)}`}
        />
        <div className="time">
          {dayjs(data.forecastStart).format('h a').toUpperCase()}
        </div>
        <div className="summary one-line">
          {titleCaseAddSpace(summary.trim())}
        </div>
      </div>
      <div
        className="condition"
        onClick={clickHandler}
        style={{
          marginRight: `${calculateMargin(
            data[conditionToShow],
            conditionToShow,
            maxValue,
            valueRange
          )}rem`,
        }}
      >
        <span
          className={
            hourlyConditionToShow === 'uvIndex'
              ? getUvIndexClasses(data[hourlyConditionToShow])
              : 'bubble'
          }
        >
          {formatCondition(
            data[hourlyConditionToShow],
            hourlyConditionToShow
          ).trim()}
        </span>
      </div>
    </li>
  );
};

Hour.displayName = 'Hour';
Hour.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
      PropTypes.bool,
    ])
  ).isRequired,
  dayData: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
      PropTypes.bool,
    ])
  ).isRequired,
  summary: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  conditionToShow: PropTypes.string.isRequired,
  valueRange: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default Hour;
