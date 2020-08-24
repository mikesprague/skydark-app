import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';
import { formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses } from '../modules/helpers'
import './Hour.scss';

export const Hour = memo((props) => {
  const { data, showSummary, isFirst, isLast, } = props;

  return (
    <li className="hour">
      <div className={`condition-bar ${isLast ? 'rounded-b-md' : ''} ${isFirst ? 'rounded-t-md' : ''} ${getConditionBarClass(data.icon, data.cloudCover)}`}></div>
      <div className="time">{dayjs.unix(data.time).format('h a').toUpperCase()}</div>
      <div className="summary">{showSummary ? data.summary : ''}</div>
      <div className="spacer">&nbsp;</div>
      <div className="condition">
        <span className="pill">{formatCondition(data.temperature, 'temperature')}</span>
      </div>
    </li>
  );
});
