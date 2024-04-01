import React from 'react';

import { resetData } from '../modules/local-storage';

export const ErrorView = () => {
  const clickHandler = () => {
    resetData();
    window.location.href = '/';
  };

  return (
    <div className="w-full text-center">
      <h3 className="text-2xl text-red-500">Sorry, an error has occurred.</h3>
      <br />
      <br />
      <button
        onClick={clickHandler}
        className="p-6 text-lg font-bold leading-loose text-gray-100 bg-red-500 dark:text-red-500 dark:bg-gray-200"
        type="button"
      >
        &nbsp;&nbsp;Click Here to Reset and Reload&nbsp;&nbsp;
      </button>
    </div>
  );
};

export default ErrorView;
