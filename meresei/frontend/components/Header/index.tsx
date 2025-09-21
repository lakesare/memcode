import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import './index.scss';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoHover = () => {
    const icon = document.querySelector('.diagonal-icon');
    if (icon) {
      icon.classList.remove('shine');
      // Force reflow to restart animation
      icon.offsetHeight;
      icon.classList.add('shine');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="diagonal-logo" onMouseEnter={handleLogoHover}>
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
        
        <IconButton 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          color="inherit"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>Home</NavLink>
          {/* <NavLink to="/sleep-tracker" className="nav-link" onClick={closeMobileMenu}>Sleep Tracker</NavLink> */}
          <NavLink to="/about" className="nav-link" onClick={closeMobileMenu}>About</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
