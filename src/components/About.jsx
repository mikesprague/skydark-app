import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { version } from '../../package.json';

import 'tippy.js/dist/tippy.css';

export const About = () => (
  <div className="contents">
    <div className="header not-fixed">
      <div className="section-name">
        <h1 className="text-center">
          <FontAwesomeIcon
            icon={['fas', 'circle-info']}
            className="footer-icon"
            fixedWidth
          />
          {' About'}
        </h1>
      </div>
    </div>
    <div className="px-4 my-8 about-content">
      <h2 className="mb-2 text-2xl font-semibold leading-loose text-center text-gray-700 version dark:text-gray-200">
        Sky Dark v{version}
      </h2>
      <h2>Background</h2>
      <p className="mt-4 text-base leading-normal text-justify">
        {'Sky Dark is an open source '}
        <Tippy
          content="Progressive Web Application"
          arrow={true}
          placement="auto"
          trigger="click"
        >
          <abbr title="Progressive Web Application">PWA</abbr>
        </Tippy>
        {' built as an homage to the now defunct Dark Sky for Android app.'}
      </p>
      <p className="mt-4 text-base leading-normal text-justify">
        More details here:
        <br />
        <a
          href="https://github.com/mikesprague/skydark-app#readme"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-600 dark:text-blue-300"
        >
          https://github.com/mikesprague/skydark-app#readme
        </a>
      </p>
      <h2 className="mb-2 text-xl font-semibold leading-loose text-center text-gray-700 dark:text-gray-200">
        Issues/Bugs
      </h2>
      <p className="mt-4 text-base leading-normal text-justify">
        Errors are tracked/reported automatically with Bugsnag.
      </p>
      <p className="mt-4 text-base leading-normal text-justify">
        Bug reports can be manually filed here:
        <br />
        <a
          href="https://github.com/mikesprague/skydark-app/issues"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-600 dark:text-blue-300"
        >
          https://github.com/mikesprague/skydark-app/issues
        </a>
      </p>
    </div>
  </div>
);

export default About;
