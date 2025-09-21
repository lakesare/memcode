import React from 'react';
import './index.scss';

const AboutPage: React.FC = () => {
  return (
    <div className="standard-article">
      <div className="container">
        {/* <h1>About Meresei</h1> */}
        <section className="about-section">
          <h2>About Meresei</h2>
          <p>
            Meresei is developed by Evgenia Karunus (<a href="https://github.com/lakesare" target="_blank">github</a>, <a href="https://lakesare.brick.do" target="_blank">blog</a>).
            <br/>
            
            I have non-24 with a 25 hour cycle, and I've been drawing calendars like this manually in excel for a long time. It's been a bother, so I decided to automate this. Automating this for myself and automating this for everyone else wasn't that far apart, so here we go :)
          </p>
        </section>

        <section className="about-section">
          <h2>Open Source</h2>
          <p>
            Meresei is open-source, you can find its source code on {` `}
            <a href="https://github.com/lakesare/memcode/tree/master/meresei" target="_blank">GitHub</a>.
          </p>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>
            To contact me, send me an email at <b>lakesare@gmail.com</b>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;