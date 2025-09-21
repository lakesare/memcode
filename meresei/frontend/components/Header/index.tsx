import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './index.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="diagonal-logo">
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
        </Link>
        
        <nav className="header-nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/sleep-tracker" className="nav-link">Sleep Tracker</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
