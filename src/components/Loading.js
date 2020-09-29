import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Loading = ({ fullHeight }) => {
  let classList = 'flex items-center justify-center h-100 w-100 loading-container';

  if (fullHeight) {
    classList = `${classList} min-h-screen`;
  }

  return (
    <div className={classList}>
      <FontAwesomeIcon icon={['fad', 'spinner']} size="3x" className="m-8" pulse />
    </div>
  );
};

Loading.defaultProps = {
  fullHeight: true,
};

Loading.propTypes = {
  fullHeight: PropTypes.bool,
};

export default Loading;
