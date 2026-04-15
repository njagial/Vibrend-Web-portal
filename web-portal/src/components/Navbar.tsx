import React from 'react';
import { Compass, Car, Map, User } from 'lucide-react';
import '../css/Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => setActiveTab('destinations')}>
          <Compass className="logo-icon" />
          <span>VIBREND</span>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <Map size={18} />
            <span>Explore</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            <Car size={18} />
            <span>Rentals</span>
          </button>
        </div>

        <div className="nav-profile">
          <button className="profile-btn">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;