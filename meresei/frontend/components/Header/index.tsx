import React from 'react';
import './index.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="diagonal-logo">
        <div className="diagonal-icon">
          <div className="diagonal-cell diagonal"></div>
          <div className="diagonal-cell"></div>
          <div className="diagonal-cell"></div>
          <div className="diagonal-cell diagonal"></div>
        </div>
        <div>
          <div className="diagonal-text">meresei</div>
          <div className="tagline">non-24 sleep calendar</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
