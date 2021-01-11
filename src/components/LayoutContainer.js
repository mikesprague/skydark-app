import PropTypes from 'prop-types';
import React from 'react';

export const LayoutContainer = ({ children }) => (
  <div className="my-16">
    {children}
  </div>
);

LayoutContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default LayoutContainer;
