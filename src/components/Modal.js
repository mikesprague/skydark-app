import React, { useEffect, useState } from 'react'
import './Modal.scss';

export const Modal = ({id, content, heading}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const overlayContainer = document.getElementById(`${id}`);
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    if (visible) {
      elementsToHide.forEach(elem => elem.classList.remove('hidden'));
      setVisible(false);
    } else {
      elementsToHide.forEach(elem => elem.classList.add('hidden'));
    }

    return () => {};
  }, [visible]);

  const clickHandler = (event) => {
    setVisible(!visible);
  };

  return (
    <div id={id} className="fixed inset-0 z-50 flex items-center justify-center hidden h-full px-4 pb-4 v-full overlay-container">
      <div onClick={clickHandler} className="fixed inset-0 hidden transition-opacity overlay">
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>
      <div onClick={clickHandler} className="z-50 hidden w-11/12 max-w-sm mx-auto overflow-hidden transition-all transform shadow-xl modal" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start">
            <div className="mt-3 text-center">
              <h3 className="mb-3 text-lg font-semibold leading-6" id="modal-headline">{heading}</h3>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
