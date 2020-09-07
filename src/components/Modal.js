import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './Modal.scss';

export const Modal = ({
  id, content, heading, weatherAlert = false, weatherAlertData = null
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const overlayContainer = document.getElementById(`${id}`);
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    if (visible) {
      elementsToHide.forEach((elem) => elem.classList.remove('hidden'));
      setVisible(false);
    } else {
      elementsToHide.forEach((elem) => elem.classList.add('hidden'));
    }

    return () => {};
  }, [visible, id]);

  const clickHandler = (event) => {
    setVisible(!visible);
    console.log(event);
  };

  return (
    <div id={id} className="fixed inset-0 z-50 flex items-center justify-center hidden h-full px-4 pb-4 v-full overlay-container">
      <div onClick={clickHandler} className="fixed inset-0 hidden transition-opacity overlay">
        <div className="absolute inset-0 bg-black opacity-75" />
      </div>
      <div onClick={clickHandler} className="z-50 hidden w-11/12 max-w-sm mx-auto overflow-hidden transition-all transform shadow-xl modal" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start">
            <div className="mt-3 text-center">
              <h3 className="mb-3 text-lg font-semibold leading-6" id="modal-headline">{weatherAlert ? weatherAlertData.title : heading}</h3>
              {weatherAlert ? (
                <>
                <p className="pl-4 mb-4 text-sm text-left">
                  <strong>Effective:</strong> {dayjs.unix(weatherAlertData.time).format('ddd, D MMM YYYY h:mm:ss A (Z)')}
                  <br />
                  <strong>Expires:</strong> {dayjs.unix(weatherAlertData.expires).format('ddd, D MMM YYYY h:mm:ss A (Z)')}
                </p>
                <p className="mb-6 text-center">
                  {weatherAlertData.description}
                </p>
                <p className="m-4 text-center">
                  <a className="px-4 py-2 my-6 text-sm bg-blue-500" href={weatherAlertData.uri} rel="noopener noreferrer" target="_blank">More Info</a>
                </p>
                </>
              ) : content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  heading: PropTypes.string,
  weatherAlert: PropTypes.bool,
  weatherAlertData: PropTypes.objectOf(PropTypes.oneOfType(
    [PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]
  )),
};

Modal.defaultProps = {
  content: '',
  heading: '',
  weatherAlert: false,
  weatherAlertData: null,
};

export default Modal;
