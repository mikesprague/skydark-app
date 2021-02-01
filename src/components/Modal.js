import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import './Modal.scss';

export const Modal = memo(({ id, content = '', heading = '', weatherAlert = true, weatherAlertData = null }) => {
  const [visible, setVisible] = useState(true);
  const overlayContainerRef = useRef();
  const overlayRef = useRef();
  const modalRef = useRef();

  useLayoutEffect(() => {
    const elementsToHide = [overlayContainerRef.current, overlayRef.current, modalRef.current];

    if (visible) {
      elementsToHide.forEach((elem) => elem.classList.remove('hidden'));
      setVisible(false);
    } else {
      elementsToHide.forEach((elem) => elem.classList.add('hidden'));
    }

    // return () => {};
  }, [visible, id]);

  const clickHandler = () => {
    setVisible(!visible);
  };

  return (
    <div id={id} ref={overlayContainerRef} className="flex overlay-container">
      <div onClick={clickHandler} ref={overlayRef} className="overlay">
        <div className="overlay-bg" />
      </div>
      <div
        onClick={clickHandler}
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start">
            <div className="mt-3 text-center">
            {weatherAlert ? (
              weatherAlertData.map((alertData, alertIdx) => (
                <div className="weatherAlertItem" key={nanoid(7)}>
                  <h3 className="modal-heading" id="modal-headline">
                    {alertData.title}
                  </h3>
                  <p className="pl-4 mb-4 text-sm text-left">
                    <strong>Effective: </strong>
                    {dayjs.unix(alertData.time).format('ddd, D MMM YYYY h:mm:ss A')}
                    <br />
                    <strong>Expires: </strong>
                    {dayjs.unix(alertData.expires).format('ddd, D MMM YYYY h:mm:ss A')}
                  </p>
                  <p className="mb-6 text-center">{alertData.description}</p>
                  <p className="m-4 text-center">
                    <a
                      className="px-4 py-2 my-6 text-sm bg-blue-500"
                      href={alertData.uri}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      More Info
                    </a>
                  </p>
                  {weatherAlertData.length > 1 && (alertIdx + 1) < weatherAlertData.length ? <hr /> : ''}
                </div>
              ))
            ) : (
              <>
                <h3 className="modal-heading" id="modal-headline">
                  {heading}
                </h3>
                {content}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
Modal.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  heading: PropTypes.string,
  weatherAlert: PropTypes.bool,
  weatherAlertData: PropTypes.arrayOf(PropTypes.object),
};
Modal.defaultProps = {
  content: '',
  heading: '',
  weatherAlert: false,
  weatherAlertData: null,
};

export default Modal;
