import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { formatCondition, getConditionBarClass, getUvIndexClasses } from '../modules/helpers';
import './Hour.scss';

export const Hour = (props) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');
  const {
    data, showSummary, isFirst, isLast, conditionToShow,
  } = props;

  useEffect(() => {
    setHourlyConditionToShow(conditionToShow);

    return () => {};
  }, [hourlyConditionToShow, conditionToShow]);

  return (
    <li className="hour">
      <div className={`condition-bar ${isLast ? 'rounded-b-md' : ''} ${isFirst ? 'rounded-t-md' : ''} ${getConditionBarClass(data)}`} />
      <div className="time">{dayjs.unix(data.time).format('h a').toUpperCase()}</div>
      <div className="summary">{showSummary ? data.summary : ''}</div>
      <div className="spacer">&nbsp;</div>
      <div className="condition">
        <span className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(data[hourlyConditionToShow]) : 'pill'}>{formatCondition(data[hourlyConditionToShow], hourlyConditionToShow)}</span>
      </div>
    </li>
  );
};

Hour.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])
  ).isRequired,
  showSummary: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  conditionToShow: PropTypes.string.isRequired,
};

export default Hour;
