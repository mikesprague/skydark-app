import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './NextHour.scss';
import { PrecipChart } from './PrecipChart';

export const NextHour = ({ data }) => {
  const [summaryText, setSummaryText] = useState(null);
  useEffect(() => {
    if (!data) { return; }

    let { summary } = data.minutely;
    summary = summary.replace('Possible ', '').replace(' for the hour.', '');
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);
    setSummaryText(summary);

    return () => setSummaryText(null);
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

    return () => setNextHourPrecipitation(false);
  }, [summaryText]);

  return nextHourPrecipitation ? (
    <>
      <PrecipChart data={data.minutely.data} />
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
