import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Tippy from '@tippyjs/react';

import 'tippy.js/dist/tippy.css';
import './About.scss';

export const About = () => (
  <div className="contents">
    <div className="header not-fixed">
      <div className="section-name">
        <h1>
          <FontAwesomeIcon
            icon={['fas', 'circle-info']}
            className="footer-icon"
            fixedWidth
          />
          {' About'}
        </h1>
      </div>
    </div>
    <div className="about-content">
      <h2>Background</h2>
      <p>
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
      <p>
        More details here:
        <br />
        <a
          href="https://github.com/mikesprague/skydark-app#readme"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://github.com/mikesprague/skydark-app#readme
        </a>
      </p>
      <h2>Issues/Bugs</h2>
      <p>Errors are tracked/reported automatically with Bugsnag.</p>
      <p>
        Bug reports can be manually filed here:
        <br />
        <a
          href="https://github.com/mikesprague/skydark-app/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://github.com/mikesprague/skydark-app/issues
        </a>
      </p>
    </div>
  </div>
);

export default About;
