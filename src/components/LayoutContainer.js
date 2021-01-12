import PropTypes from 'prop-types';
import React, { memo } from 'react';

export const LayoutContainer = memo(({ children }) => (
  <div className="my-16">
    {children}
  </div>
));

LayoutContainer.displayName = 'LayoutContainer';
LayoutContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default LayoutContainer;
