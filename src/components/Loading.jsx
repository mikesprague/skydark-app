import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export const Loading = ({ fullHeight }) => {
  const classList = fullHeight
    ? 'flex items-center justify-center min-h-screen w-full'
    : 'flex items-center justify-center h-full w-full';

  return (
    <div className={classList}>
      <FontAwesomeIcon
        icon={['fad', 'spinner']}
        size="3x"
        className="m-8"
        pulse
      />
    </div>
  );
};

Loading.displayName = 'Loading';
Loading.defaultProps = {
  fullHeight: true,
};
Loading.propTypes = {
  fullHeight: PropTypes.bool,
};

export default Loading;
