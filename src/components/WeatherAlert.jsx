import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';

import { openModalWithComponent } from '../modules/helpers.js';

export const WeatherAlert = () => {
  const { weatherData: weather } = useWeatherDataContext();

  const alertData = weather?.weatherAlertsData?.length
    ? weather.weatherAlertsData
    : null;

  const formatAlert = (alert) => {
    console.log(alert);
    return alert.includes('\n* ')
      ? alert.split('\n* ').map((alertPart, idx) => {
          if (idx === 0) {
            return `${alertPart
              .replace('*', ' ')
              .replace(/\.\.\./, ': ')
              .trim()}\n\n`;
          }
          return `${alertPart.replace(/\.\.\./, ': ').trim()}\n\n`;
        })
      : alert.split('...\n').map((alertPart, _idx) => {
          // if (idx === 0) {
          //   return alertPart.replace(/\.\.\./g, ' ').trim();
          // }
          return `${alertPart.replace(/\.\.\./, ': ').trim()}\n\n`;
        });
  };

  const weatherAlertHandler = () => {
    openModalWithComponent(
      <div className="max-w-2xl">
        {alertData.map((alert, alertIdx) => (
          <div key={nanoid(7)}>
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-5">
                <FontAwesomeIcon
                  icon={['fad', 'triangle-exclamation']}
                  size="2x"
                  className="text-orange-500"
                />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {alert.description}
                </h3>
              </div>

              <div className="mb-2 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-300 dark:border-orange-700 shadow-sm">
                {/* <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4"> */}
                <div className="grid grid-cols-1 gap-2 text-base text-left text-gray-700 dark:text-gray-300">
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
                {/* </div> */}
              </div>

              {alert?.messages[0]?.text && (
                <div className="mb-5 p-5">
                  {formatAlert(alert.messages[0].text).map((alertPart) => {
                    const parts = alertPart.split(/([A-Z\s]+:)/g);
                    const partKey = nanoid(6);
                    return (
                      <p
                        className="mb-4 text-lg text-left text-gray-700 dark:text-gray-300 leading-relaxed"
                        key={partKey}
                      >
                        {parts.map((part, partIdx) => {
                          if (/^[A-Z\s]+:$/.test(part)) {
                            return (
                              <strong
                                key={`${nanoid(6)}-${partIdx}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {part}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              )}

              <div className="text-center mt-6">
                <a
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  href={alert.detailsUrl}
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
    <div className="text-center wrap-break-word">
      <button
        type="button"
        onClick={weatherAlertHandler}
        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium border border-orange-400 text-orange-400 rounded-full hover:bg-orange-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <FontAwesomeIcon icon={['far', 'circle-exclamation']} />
        <span>
          {alertData[0].description}
          {alertData.length > 1 ? ` | +${alertData.length - 1}` : ''}
        </span>
      </button>
    </div>
  ) : null;
};

export default WeatherAlert;
