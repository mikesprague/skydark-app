import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

import { metricToImperial } from '../modules/helpers.js';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import './PrecipChart.css';

export const PrecipChart = () => {
  const [chartData, setChartData] = useState(null);

  const { weatherData: weather } = useWeatherDataContext();

  useEffect(() => {
    if (!weather) {
      return;
    }

    const dataArray = [['Minute', 'Precipitation']];

    const minutes = weather?.forecastNextHour?.minutes.slice(0, 61);
    let index = 0;

    for (const minute of minutes) {
      dataArray.push([
        index,
        metricToImperial.mmToIn(
          weather?.forecastNextHour?.summary[0]?.condition.toLowerCase() ===
            'snow'
            ? minute.precipitationIntensity * 2
            : minute.precipitationIntensity
        ),
      ]);
      index += 1;
    }
    setChartData(dataArray);

    return () => {
      setChartData(null);
      index = 0;
    };
  }, [weather]);

  return chartData ? (
    <Chart
      width="100%"
      height="140px"
      chartType="ColumnChart"
      loader={<div className="text-center text-transparent">Loading...</div>}
      data={chartData}
      options={{
        backgroundColor: 'transparent',
        series: [{ color: '#76a9fa', areaOpacity: 0.75 }],
        hAxis: {
          baselineColor: 'transparent',
          gridlines: { color: 'transparent', count: 7 },
          textPosition: 'out',
          textStyle: { color: '#999' },
          ticks: [
            { v: 0, f: '' },
            { v: 10, f: '10 min' },
            { v: 20, f: '20 min' },
            { v: 30, f: '30 min' },
            { v: 40, f: '40 min' },
            { v: 50, f: '50 min' },
            { v: 60, f: '' },
          ],
        },
        vAxis: {
          baselineColor: 'transparent',
          gridlines: { color: '#999' },
          textPosition: 'in',
          textStyle: { color: '#ccc' },
          ticks: [
            { v: 0, f: '' },
            { v: 0.08, f: 'LIGHT' },
            { v: 0.16, f: 'MED' },
            { v: 0.24, f: 'HEAVY' },
          ],
          viewWindow: { min: 0, max: 0.28 },
          viewWindowMode: 'maximized',
        },
        tooltip: {
          trigger: 'none',
        },
        enableInteractivity: false,
        bar: { groupWidth: '80%' },
        pointsVisible: false,
        chartArea: { width: '100%', height: '140px', top: 0 },
        titlePosition: 'in',
        axisTitlesPosition: 'in',
        legend: 'none',
      }}
    />
  ) : (
    ''
  );
};

export default PrecipChart;
