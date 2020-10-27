import React from 'react';
import './About.scss';

export const About = () => (
  <div className="contents">
    <div className="header">
      <div className="section-name">
        <h1>About</h1>
      </div>
    </div>
    <div className="about-content">
      <div>
        <h2>Background</h2>
        <p>
          {'Sky Dark is an open source '}
          <abbr title="Progressive Web Application">PWA</abbr>
          {' built as an homage to the now defunct Dark Sky for Android app.'}
        </p>
        <p>
          Please note that this is a work in progress and is NOT an exact replica in functionality or design.
          I built it mainly to learn a few new things and because the Dark Sky for Android app used to be my
          daily driver and I missed the experience.
        </p>
        <h2>Issues/Bugs</h2>
        <p>Errors are tracked automatically with Bugsnag.</p>
        <p>
          Bug reports can be filed manually here:
          <br />
          <a href="https://github.com/mikesprague/skydark-app/issues" rel="noopener noreferrer" target="_blank">https://github.com/mikesprague/skydark-app/issues</a>
        </p>
      </div>
    </div>
  </div>
);

export default About;
