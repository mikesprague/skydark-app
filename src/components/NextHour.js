import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './NextHour.scss';

export const NextHour = ({ data }) => {
  const [summaryText, setSummaryText] = useState(null);
  useEffect(() => {
    if (!data) { return; }

    let { summary } = data.minutely;
    summary = summary.replace('Possible ', '').replace(' for the hour.', '');
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);
    setSummaryText(summary);

    return () => { setSummaryText(null); };
  }, [data]);

  const [nextHourPrecipitation, setNextHourPrecipitation] = useState(false);
  useEffect(() => {
    if (!summaryText) { return; }

    if (summaryText.toLowerCase().includes('rain')
        || summaryText.toLowerCase().includes('drizzle')
        || summaryText.toLowerCase().includes('snow')
        || summaryText.toLowerCase().includes('flurries')
        || summaryText.toLowerCase().includes('sleet')
        || summaryText.toLowerCase().includes('start')
        || summaryText.toLowerCase().includes('stop')
    ) {
      setNextHourPrecipitation(true);
    }

    return () => { setNextHourPrecipitation(false); };
  }, [summaryText]);

  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    if (!nextHourPrecipitation) { return; }

    const dataArray = [
      ['Minute', 'Precipitation'],
    ];
    data.minutely.data.forEach((minute, index) => {
      dataArray.push([index, minute.precipIntensity]);
    });
    setChartData(dataArray);

    return () => { setChartData(null); };
  }, [nextHourPrecipitation, data]);

  return nextHourPrecipitation ? (
    <>
      <Chart
        width="100%"
        height="140px"
        chartType="AreaChart"
        loader={<div className="text-center text-transparent">Loading...</div>}
        data={chartData}
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
            gridlines: { color: '#999' },
            textPosition: 'in',
            textStyle: { color: '#ccc' },
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
      <p className="px-4 mb-4 -mt-6 text-base text-center">
        {`Next Hour: ${summaryText}`}
      </p>
    </>
  ) : (
    <p className="px-4 mb-4 text-base text-center">
      {`Next Hour: ${summaryText}`}
    </p>
  );
};

NextHour.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  ).isRequired,
};

export default NextHour;
