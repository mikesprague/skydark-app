import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';

import { openModalWithComponent } from '../modules/helpers.js';

import './WeatherAlert.css';

export const WeatherAlert = () => {
  const { weatherData: weather } = useWeatherDataContext();

  const alertData = weather?.weatherAlertsData?.length
    ? weather.weatherAlertsData
    : null;

  const formatAlert = (alert) => {
    return alert.includes('\n* ')
      ? alert.split('\n* ').map((alertPart, idx) => {
          if (idx === 0) {
            return alertPart.replace(/\.\.\./g, ' ').trim();
          }
          return `${alertPart.replace(/\.\.\./, ': ').trim()}\n\n`;
        })
      : alert.split('...\n').map((alertPart, idx) => {
          if (idx === 0) {
            return alertPart.replace(/\.\.\./g, ' ').trim();
          }
          return `${alertPart.replace(/\.\.\./, ': ').trim()}\n\n`;
        });
  };

  const weatherAlertHandler = () => {
    openModalWithComponent(
      <div className="max-w-2xl">
        {alertData.map((alert, alertIdx) => (
          <div key={nanoid(7)}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={['fad', 'triangle-exclamation']}
                  size="2x"
                  className="text-orange-500"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {alert.description}
                </h3>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Issued:
                    </strong>{' '}
                    {dayjs(alert.issuedTime).format('ddd, D MMM YYYY h:mm A')}
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Effective:
                    </strong>{' '}
                    {dayjs(alert.effectiveTime).format(
                      'ddd, D MMM YYYY h:mm A'
                    )}
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Expires:
                    </strong>{' '}
                    {dayjs(alert.expireTime).format('ddd, D MMM YYYY h:mm A')}
                  </div>
                </div>
              </div>

              {alert?.messages[0]?.text && (
                <>
                  <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="font-semibold text-base text-gray-900 dark:text-gray-100">
                      {formatAlert(alert.messages[0].text)[0]}
                    </p>
                  </div>

                  {formatAlert(alert.messages[0].text).map((alertPart, idx) => {
                    if (idx >= 1) {
                      return (
                        <p
                          className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                          key={nanoid(6)}
                        >
                          {alertPart}
                        </p>
                      );
                    }
                    return null;
                  })}
                </>
              )}

              <div className="text-center">
                <a
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600"
                  href={alert.attributionURL}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`View alert source for ${alert.description}`}
                >
                  <FontAwesomeIcon
                    icon={['fad', 'arrow-up-right-from-square']}
                  />
                  View Source
                </a>
              </div>
            </div>

            {alertData.length > 1 && alertIdx + 1 < alertData.length && (
              <hr className="my-6 border-gray-300 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>,
      {
        position: 'center',
        padding: '1.5rem',
        width: '42rem',
      }
    );
  };

  return alertData ? (
    <div className="weather-alert-container">
      <button
        type="button"
        onClick={weatherAlertHandler}
        className="weather-alert-button"
      >
        <span className="leading-loose">
          <FontAwesomeIcon icon={['far', 'circle-exclamation']} />
          &nbsp;
          {alertData.length > 1
            ? `${alertData[0].description} | +${alertData.length - 1}`
            : alertData[0].description}
        </span>
      </button>
    </div>
  ) : null;
};

export default WeatherAlert;
