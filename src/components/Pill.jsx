import PropTypes from 'prop-types';

import './Pill.css';

export const Pill = ({ clickHandler, dataLabel, label, selected }) => (
  <button
    type="button"
    className={selected ? 'pill-selected' : 'pill'}
    onClick={clickHandler}
    data-label={dataLabel}
    aria-pressed={selected}
  >
    {label}
  </button>
);

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
