import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';

const Header: React.FC = () => {
  const location = useLocation();

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
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
