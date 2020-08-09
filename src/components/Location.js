import React, { Fragment, useEffect, useState } from 'react';
import './Location.scss';

export const Location = (props) => {
  return (
    <Fragment>
      <h1>{props.name  ? props.name : 'Acquiring location'}</h1>
    </Fragment>
  );
};

export default Location;
