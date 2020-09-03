import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Loading = memo((props) => {

  return (
    <div className="flex items-center justify-center min-h-screen h-100 w-100 loading-container">
      <FontAwesomeIcon icon={['fad', 'spinner']} size="3x" pulse />
    </div>
  )
});

export default Loading;
