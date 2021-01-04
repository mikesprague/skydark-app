import PropTypes from 'prop-types';
import React, { memo } from 'react';
import './Pill.scss';

export const Pill = memo(({ clickHandler, dataLabel, label, selected }) => (
  <div className={selected ? 'pill-selected' : 'pill'} onClick={clickHandler} data-label={dataLabel}>
    {label}
  </div>
));

Pill.displayName = 'Pill';
Pill.defaultProps = {
  selected: false,
};
Pill.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  dataLabel: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

export default Pill;
