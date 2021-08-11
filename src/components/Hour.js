import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { HourlyConditions } from './HourlyConditions';
import { formatCondition, getConditionBarClass, getUvIndexClasses } from '../modules/helpers';
import './Hour.scss';

export const Hour = ({ data, dayData, summary, isFirst, isLast, conditionToShow, valScale = 1 }) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');

  useEffect(() => {
    setHourlyConditionToShow(conditionToShow);

    // return () => {};
  }, [hourlyConditionToShow, conditionToShow]);

  const clickHandler = () => {
    const overlayContainer = document.getElementById(`hourly-conditions-modal-${data.time}`);
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    elementsToHide.forEach((elem) => elem.classList.remove('hidden'));
  };

  return (
    <li className="hour">
      <div className="hour-wrap">
        <div
          className={`condition-bar ${isLast ? 'rounded-b-md' : ''} ${
            isFirst ? 'rounded-t-md' : ''
          } ${getConditionBarClass(data)}`}
        />
        <div className="time">{dayjs.unix(data.time).format('h a').toUpperCase()}</div>
        <div
          className={`summary${
            summary.replace('Humid and ', '').replace(' and Humid', '').replace(' and humid', '').split(' ').length > 2
              ? ''
              : ' one-line'
          }`}
        >
          {summary.replace('Humid and ', '').replace(' and Humid', '').replace(' and humid', '')}
        </div>
        <div className="spacer">&nbsp;</div>
      </div>
      <div
        className="condition"
        onClick={clickHandler}
        style={
          ['temperature', 'apparentTemperature', 'dewPoint'].includes(conditionToShow)
            ? { marginRight: `${Math.round(100 - Math.round(data[conditionToShow]) * valScale)}%` }
            : {}
        }
      >
        <span
          className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(data[hourlyConditionToShow]) : 'bubble'}
        >
          {formatCondition(data[hourlyConditionToShow], hourlyConditionToShow).trim()}
        </span>
      </div>
      <HourlyConditions data={data} dayData={dayData} />
    </li>
  );
};

Hour.displayName = 'Hour';
Hour.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]))
    .isRequired,
  dayData: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  ).isRequired,
  summary: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  conditionToShow: PropTypes.string.isRequired,
  valScale: PropTypes.number.isRequired,
};

export default Hour;
