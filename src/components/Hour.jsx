import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import {
  formatCondition,
  getConditionBarClass,
  getUvIndexClasses,
  metricToImperial,
  openModalWithComponent,
  titleCaseToSentenceCase,
} from '../modules/helpers';

import './Hour.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

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

    // return () => {};
  }, [hourlyConditionToShow, conditionToShow]);

  const [summaryText, setSummaryText] = useState('');

  useEffect(() => {
    setSummaryText(titleCaseToSentenceCase(summary).trim());
  }, [summary]);

  const clickHandler = () => {
    openModalWithComponent(
      <>
        <h3 className="modal-heading" id="modal-headline">
          {`${dayjs(data.forecastStart).format('ddd, MMMM D')} at ${dayjs(
            data.forecastStart,
          ).format('h:mm A')}`}
        </h3>
        <h4 className="mb-2 text-lg">{data.summary}</h4>
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
              {` ${formatCondition(data.windSpeed, 'windSpeed')} mph `}
              <FontAwesomeIcon
                icon={['fad', 'circle-chevron-up']}
                size="lg"
                transform={{ rotate: data.windBearing }}
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
                '--fa-priamry-color': 'royalblue',
                '--fa-secondary-color': 'sienna',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Precipitaton:
              {` ${formatCondition(
                data.precipitationChance,
                'precipitationChance',
              )}`}
              <br />
              Intensity:
              {` ${formatCondition(
                data.precipitationIntensity,
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
              Visibiity:
              {` ${formatCondition(data.visibility, 'visibility')} mi`}
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
              {` ${formatCondition(
                dayData.sunsetTime,
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
        <div className="summary one-line">{summaryText.trim()}</div>
        <div className="spacer">&nbsp;</div>
      </div>
      <div
        className="condition"
        onClick={clickHandler}
        style={
          [
            'temperature',
            'temperatureApparent',
            'temperatureDewPoint',
          ].includes(conditionToShow)
            ? {
                marginRight: `${
                  (maxValue -
                    Math.round(metricToImperial.cToF(data[conditionToShow]))) *
                  (100 / valueRange) *
                  0.05
                }rem`,
              }
            : {}
        }
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
            hourlyConditionToShow,
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
    ]),
  ).isRequired,
  dayData: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
      PropTypes.bool,
    ]),
  ).isRequired,
  summary: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  conditionToShow: PropTypes.string.isRequired,
  valueRange: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default Hour;
