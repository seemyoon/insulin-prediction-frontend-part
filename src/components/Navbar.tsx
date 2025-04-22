import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            Medical Dashboard
          </Link>
        </div>
        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/diagnosis" 
            className={`nav-link ${location.pathname === '/diagnosis' ? 'active' : ''}`}
          >
            Patient Diagnosis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 