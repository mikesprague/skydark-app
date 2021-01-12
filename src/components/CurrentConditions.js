import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCondition } from '../modules/helpers';
import { Modal } from './Modal';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './CurrentConditions.scss';

export const CurrentConditions = () => {
  const data = useContext(WeatherDataContext);

  return (
    <Modal
      id="current-conditions-modal"
      weatherAlert={false}
      heading="Current Conditions"
      content={(
        <>
          <h4 className="mb-2 text-lg">
            {data.weather.currently.summary}
          </h4>
          <div className="flex flex-wrap mt-2">
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'thermometer-half']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'red', '--fa-secondary-color': 'lightgray', '--fa-secondary-opacity': '.9' }}
              />
              <br />
              <small>
                Temp:
                {` ${formatCondition(data.weather.currently.temperature, 'temperature')}`}
                <br />
                Feels Like:
                {` ${formatCondition(data.weather.currently.apparentTemperature, 'apparentTemperature')}`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'wind-turbine']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'dodgerblue', '--fa-secondary-color': 'silver', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Wind:
                {` ${formatCondition(data.weather.currently.windSpeed, 'windSpeed')} mph `}
                <FontAwesomeIcon
                  icon={['fad', 'chevron-circle-up']}
                  size="lg"
                  transform={{ rotate: data.weather.currently.windBearing }}
                  style={{ '--fa-primary-color': 'ghostwhite', '--fa-secondary-color': 'darkslategray', '--fa-secondary-opacity': '1' }}
                  fixedWidth
                />
                <br />
                Gusts:
                {` ${formatCondition(data.weather.currently.windGust, 'windGust')} mph`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'humidity']}
                size="2x"
                swapOpacity
                fixedWidth
                style={{ '--fa-primary-color': 'black', '--fa-secondary-color': 'deepskyblue', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Humidity:
                {` ${formatCondition(data.weather.currently.humidity, 'humidity')}`}
                <br />
                Dew Point:
                {` ${formatCondition(data.weather.currently.dewPoint, 'dewPoint')}`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'umbrella']}
                size="2x"
                swapOpacity
                fixedWidth
                style={{ '--fa-primary-color': 'royalblue', '--fa-secondary-color': 'sienna', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Precipitaton:
                {` ${formatCondition(data.weather.currently.precipProbability, 'precipProbability')}`}
                <br />
                Intensity:
                {` ${formatCondition(data.weather.currently.precipIntensity, 'precipIntensity')} in/hr`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'tachometer-alt']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'crimson', '--fa-secondary-color': 'lightgray', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Pressure:
                {` ${formatCondition(data.weather.currently.pressure, 'pressure')} mb`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'clouds']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'darkgray', '--fa-secondary-color': 'silver', '--fa-secondary-opacity': '1' }}
              />
              <br />
              <small>
                Cloud Cover:
                {` ${formatCondition(data.weather.currently.cloudCover, 'cloudCover')}`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'sun']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'gold', '--fa-secondary-color': 'darkorange', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                UV Index:
                {` ${formatCondition(data.weather.currently.uvIndex, 'uvIndex')}`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'eye']}
                size="2x"
                fixedWidth
                style={{ '--fa-primary-color': 'skyblue', '--fa-secondary-color': 'lightgray', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Visibiity:
                {` ${formatCondition(data.weather.currently.visibility, 'visibility')} mi`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'sunrise']}
                size="2x"
                swapOpacity
                fixedWidth
                style={{ '--fa-primary-color': 'darkorange', '--fa-secondary-color': 'gold', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Sunrise:
                {` ${formatCondition(data.weather.daily.data[0].sunriseTime, 'sunriseTime').toLowerCase()}`}
              </small>
            </div>
            <div className="conditions-item">
              <FontAwesomeIcon
                icon={['fad', 'sunset']}
                size="2x"
                swapOpacity
                fixedWidth
                style={{ '--fa-primary-color': 'darkorange', '--fa-secondary-color': 'gold', '--fa-secondary-opacity': '.75' }}
              />
              <br />
              <small>
                Sunset:
                {` ${formatCondition(data.weather.daily.data[0].sunsetTime, 'sunsetTime').toLowerCase()}`}
              </small>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default CurrentConditions;
