import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCondition, getWeatherIcon } from '../modules/helpers';
import { Modal } from '../components/Modal';
import './Conditions.scss';

export const Conditions = ({ data, date = null }) => {
  const [conditionsHeading, setConditionsHeading] = useState('Current Conditions');

  useEffect(() => {
    if (date) {
      setConditionsHeading(`${dayjs(date).format('DDD, MMMM, D')} at ${dayjs(date).format('h:mm A')}`)
    }

    // return () => {};
  }, []);

  return (
    <Modal heading={conditionsHeading} content={
      <Fragment>
        <h4 className="mb-2 text-lg">
          {/* <FontAwesomeIcon icon={['fad', getWeatherIcon(data.currently.icon)]} fixedWidth size="2x" />
          <br /> */}
          {data.currently.summary}
        </h4>
        <div className="flex flex-wrap mt-2">
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'thermometer-half']} size="2x" fixedWidth />
            <br />
            <small>
              Temp: {formatCondition(data.currently.temperature, 'temperature')}
              <br />
              Feels Like: {formatCondition(data.currently.apparentTemperature, 'apparentTemperature')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'wind']} size="2x" swapOpacity fixedWidth />
            <br />
            <small>
              Wind: <FontAwesomeIcon icon={['fad', 'chevron-circle-up']} size="lg" transform={{ rotate: 42 }} fixedWidth /> {formatCondition(data.currently.windSpeed, 'windSpeed')}
              <br />
              Gusts: {formatCondition(data.currently.windGust, 'windGust')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'cloud']} size="2x" swapOpacity fixedWidth />
            <br />
            <small>
              Cloud Cover: {formatCondition(data.currently.cloudCover, 'cloudCover')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'eye']} size="2x" fixedWidth />
            <br />
            <small>
              Visibiity: {formatCondition(data.currently.visibility, 'visibility')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'humidity']} size="2x" fixedWidth />
            <br />
            <small>
              Humidity: {formatCondition(data.currently.humidity, 'humidity')}
              {/* <br />
              Dew Point: {formatCondition(data.currently.dewPoint, 'dewPoint')} */}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'tachometer']} size="2x" fixedWidth />
            <br />
            <small>
              Pressure: {formatCondition(data.currently.pressure, 'pressure')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'umbrella']} size="2x" swapOpacity fixedWidth />
            <br />
            <small>
              Precip: {formatCondition(data.currently.precipProbability, 'precipProbability')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'sun']} size="2x" fixedWidth />
            <br />
            <small>
              UV Index: {formatCondition(data.currently.uvIndex, 'uvIndex')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'sunrise']} size="2x" fixedWidth />
            <br />
            <small>
              Sunrise: {formatCondition(data.daily.data[0].sunriseTime, 'sunriseTime')}
            </small>
          </div>
          <div className="w-1/2 mb-4 leading-5 text-center">
            <FontAwesomeIcon icon={['fad', 'sunset']} size="2x" fixedWidth />
            <br />
            <small>
              Sunset: {formatCondition(data.daily.data[0].sunsetTime, 'sunsetTime')}
            </small>
          </div>
        </div>
      </Fragment>
    } />
  );
};

export default Conditions;
