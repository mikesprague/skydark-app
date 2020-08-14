import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCondition } from '../modules/helpers';
import './Conditions.scss';

export const Conditions = ({ data, isVisible }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const overlayContainer = document.querySelector('.overlay-container');
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    if (visible) {
      overlayContainer.classList.add('fixed');
      elementsToHide.forEach(elem => elem.classList.remove('hidden'));
      setVisible(false); // prevent needing to click twice to close - need to look into this for better fix
    } else {
      overlayContainer.classList.remove('fixed');
      elementsToHide.forEach(elem => elem.classList.add('hidden'));
    }

    // return () => {};
  }, [visible]);

  const clickHandler = (event) => {
    setVisible(!visible);
  };

  return (
    <div className="inset-0 hidden px-4 pb-4 overlay-container">
      <div onClick={clickHandler} className="fixed inset-0 hidden transition-opacity overlay">
        <div className="absolute inset-0 z-20 bg-black opacity-75"></div>
      </div>
      <div onClick={clickHandler} className="z-50 hidden w-11/12 max-w-sm mx-auto mt-8 overflow-hidden transition-all transform shadow-xl modal" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div className="z-50 px-4 pt-5 pb-4">
          <div className="z-50 sm:flex sm:items-start">
            <div className="z-50 mt-3 text-center">
              <h3 className="mb-6 text-lg font-semibold leading-6" id="modal-headline">Current Conditions</h3>
              <div className="flex flex-wrap mt-2">
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'thermometer-half']} size="2x" />
                  <br />
                  <small>
                    Temp: {formatCondition(data.currently.temperature, 'temperature')}
                    <br />
                    Feels Like: {formatCondition(data.currently.apparentTemperature, 'apparentTemperature')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'wind']} size="2x" swapOpacity />
                  <br />
                  <small>
                    Wind: <FontAwesomeIcon icon={['fad', 'chevron-circle-up']} size="lg" transform={{ rotate: 42 }} /> {formatCondition(data.currently.windSpeed, 'windSpeed')}
                    <br />
                    Gusts: {formatCondition(data.currently.windGust, 'windGust')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'cloud']} size="2x" swapOpacity />
                  <br />
                  <small>
                    Cloud Cover: {formatCondition(data.currently.cloudCover, 'cloudCover')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'eye']} size="2x" />
                  <br />
                  <small>
                    Visibiity: {formatCondition(data.currently.visibility, 'visibility')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'humidity']} size="2x" />
                  <br />
                  <small>
                    Humidity: {formatCondition(data.currently.humidity, 'humidity')}
                    {/* <br />
                    Dew Point: {formatCondition(data.currently.dewPoint, 'dewPoint')} */}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'tachometer']} size="2x" />
                  <br />
                  <small>
                    Pressure: {formatCondition(data.currently.pressure, 'pressure')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'umbrella']} size="2x" swapOpacity />
                  <br />
                  <small>
                    Precip: {formatCondition(data.currently.precipProbability, 'precipProbability')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'sun']} size="2x" />
                  <br />
                  <small>
                    UV Index: {formatCondition(data.currently.uvIndex, 'uvIndex')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'sunrise']} size="2x" />
                  <br />
                  <small>
                    Sunrise: {formatCondition(data.daily.data[0].sunriseTime, 'sunriseTime')}
                  </small>
                </div>
                <div className="w-1/2 mb-4 leading-5 text-center">
                  <FontAwesomeIcon icon={['fad', 'sunset']} size="2x" />
                  <br />
                  <small>
                    Sunset: {formatCondition(data.daily.data[0].sunsetTime, 'sunsetTime')}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
