import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses,
} from '../modules/helpers';
import './CurrentHourly.scss';

export const CurrentHourly = ({ data }) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');

  const changeHandler = (event) => {
    const lastSelected = document.querySelector('.current-hourly-container .condition-select-container .pill-selected');
    setHourlyConditionToShow(event.target.dataset.label);
    event.target.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
    lastSelected.classList.add('pill');
    lastSelected.classList.remove('pill-selected');
    event.target.classList.add('pill-selected');
  };

  const nextHourRain = () => {
    const { summary } = data.minutely;
    if (summary && (summary.toLowerCase().includes('rain') || summary.toLowerCase().includes('drizzle') || summary.toLowerCase().includes('start') || summary.toLowerCase().includes('stop'))) {
      return true;
    }
    return false;
  };

  const dataArray = [
    ['Minute', 'Precipitation'],
  ];

  data.minutely.data.forEach((minute, index) => {
    dataArray.push([index, minute.precipIntensity]);
  });

  return (
    <div className="current-hourly-container">
      {nextHourRain()
        ? (
          <Chart
            width="100%"
            height="140px"
            chartType="AreaChart"
            loader={<div className="text-center text-transparent">Loading...</div>}
            data={dataArray}
            options={{
              backgroundColor: 'transparent',
              series: [
                { color: '#76a9fa', areaOpacity: 0.75 },
              ],
              hAxis: {
                baselineColor: 'transparent',
                gridlines: { color: 'transparent', count: 5 },
                textPosition: 'out',
                textStyle: { color: '#999' },
                ticks: [{ v: 0, f: '' }, { v: 10, f: '10 min' }, { v: 20, f: '20 min' }, { v: 30, f: '30 min' }, { v: 40, f: '40 min' }, { v: 50, f: '50 min' }, { v: 60, f: '' }],
              },
              vAxis: {
                baselineColor: 'transparent',
                gridlines: { color: '#666'},
                textPosition: 'in',
                textStyle: { color: '#aaa' },
                ticks: [{ v: 0, f: '' }, { v: 0.1, f: 'LIGHT' }, { v: 0.2, f: 'MED' }, { v: 0.3, f: 'HEAVY' }],
                viewWindow: { min: 0, max: 0.34 },
                viewWindowMode: 'maximized',
              },
              tooltip: {
                trigger: 'none',
              },
              enableInteractivity: false,
              lineWidth: 0.25,
              pointsVisible: false,
              chartArea: { width: '100%', height: '140px', top: 0 },
              titlePosition: 'in',
              axisTitlesPosition: 'in',
              legend: 'none',
            }}
          />
        )
        : ''}
      <p className={nextHourRain() ? '-mt-6 px-2 mb-4 text-base text-center' : 'px-2 mb-2 text-base text-center'}>
        {`Next Hour: ${data.minutely.summary.replace(' for the hour.', '')}`}
      </p>
      <ul className="hourly">
        {data.hourly.data.map((hourData, index) => {
          const startIndex = dayjs().format('m') <= 30 && dayjs.unix(data.hourly.data[0].time).format('h') === dayjs().format('h') ? 0 : 1;
          const endIndex = startIndex + 20;
          return (index >= startIndex && index <= endIndex) && index % 2 === startIndex ? (
            <li key={nanoid(7)} className="hour">
              <div className={`condition-bar ${index === endIndex ? 'rounded-b-md' : ''} ${index === startIndex ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`} />
              <div className="time">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
              <div className="summary">{hourData && data && formatSummary(hourData, data.hourly.data, index, startIndex)}</div>
              <div className="condition">
                <span className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(hourData[hourlyConditionToShow]) : 'pill'}>
                  {formatCondition(hourData[hourlyConditionToShow], hourlyConditionToShow)}
                </span>
              </div>
            </li>
          ) : '';
        })}
      </ul>
      <div className="flex condition-select-container">
        <div className="pill-selected" onClick={changeHandler} data-label="temperature">Temp (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="apparentTemperature">Feels-Like (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="precipProbability">Precip Prob (%)</div>
        <div className="pill" onClick={changeHandler} data-label="precipIntensity">Precip Rate (IN/HR)</div>
        <div className="pill" onClick={changeHandler} data-label="windSpeed">Wind (MPH)</div>
        <div className="pill" onClick={changeHandler} data-label="windGust">Wind Gust (MPH)</div>
        <div className="pill" onClick={changeHandler} data-label="humidity">Humidity (%)</div>
        <div className="pill" onClick={changeHandler} data-label="dewPoint">Dew Point (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="uvIndex">UV Index</div>
        <div className="pill" onClick={changeHandler} data-label="cloudCover">Cloud Cover (%)</div>
        <div className="pill" onClick={changeHandler} data-label="pressure">Pressure (MB)</div>
      </div>
    </div>
  );
};

CurrentHourly.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  ).isRequired,
};

export default CurrentHourly;
