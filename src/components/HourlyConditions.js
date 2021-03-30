import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCondition } from '../modules/helpers';
import { Modal } from './Modal';
import './CurrentConditions.scss';

export const HourlyConditions = memo(({ data, dayData }) => data ? (
  <Modal
    id={`hourly-conditions-modal-${data.time}`}
    weatherAlert={false}
    heading={`${dayjs.unix(data.time).format('ddd, MMMM D')} at ${dayjs.unix(data.time).format('h:mm A')}`}
    content={
      <>
        <h4 className="mb-2 text-lg">{data.summary.replace('Possible ', '')}</h4>
        <div className="flex flex-wrap mt-2">
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'temperature-half']}
              size="2x"
              fixedWidth
              style={{
                '--fa-secondary-color': 'red',
                '--fa-primary-color': 'lightgray',
                '--fa-secondary-opacity': '.9',
              }}
            />
            <br />
            <small>
              Temp:
              {` ${formatCondition(data.temperature, 'temperature')}`}
              <br />
              Feels Like:
              {` ${formatCondition(data.apparentTemperature, 'apparentTemperature')}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'wind-turbine']}
              size="2x"
              fixedWidth
              style={{
                '--fa-secondary-color': 'dodgerblue',
                '--fa-primary-color': 'silver',
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
                  '--fa-secondary-color': 'ghostwhite',
                  '--fa-primary-color': 'darkslategray',
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
                '--fa-secondary-color': 'black',
                '--fa-primary-color': 'deepskyblue',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Humidity:
              {` ${formatCondition(data.humidity, 'humidity')}`}
              <br />
              Dew Point:
              {` ${formatCondition(data.dewPoint, 'dewPoint')}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'umbrella']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-secondary-color': 'royalblue',
                '--fa-primary-color': 'sienna',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Precipitaton:
              {` ${formatCondition(data.precipProbability, 'precipProbability')}`}
              <br />
              Intensity:
              {` ${formatCondition(data.precipIntensity, 'precipIntensity')} in/hr`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'clouds']}
              size="2x"
              fixedWidth
              style={{
                '--fa-secondary-color': 'darkgray',
                '--fa-primary-color': 'silver',
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
                '--fa-secondary-color': 'skyblue',
                '--fa-primary-color': 'lightgray',
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
                '--fa-secondary-color': 'crimson',
                '--fa-primary-color': 'lightgray',
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
                '--fa-secondary-color': 'gold',
                '--fa-primary-color': 'darkorange',
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
                '--fa-secondary-color': 'darkorange',
                '--fa-primary-color': 'gold',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Sunrise:
              {` ${formatCondition(dayData.sunriseTime, 'sunriseTime').toLowerCase()}`}
            </small>
          </div>
          <div className="conditions-item">
            <FontAwesomeIcon
              icon={['fad', 'sunset']}
              size="2x"
              swapOpacity
              fixedWidth
              style={{
                '--fa-secondary-color': 'darkorange',
                '--fa-primary-color': 'gold',
                '--fa-secondary-opacity': '.75',
              }}
            />
            <br />
            <small>
              Sunset:
              {` ${formatCondition(dayData.sunsetTime, 'sunsetTime').toLowerCase()}`}
            </small>
          </div>
        </div>
      </>
    }
  />
) : '');

HourlyConditions.displayName = 'HourlyConditions';
HourlyConditions.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]))
    .isRequired,
  dayData: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  ).isRequired,
};

export default HourlyConditions;
