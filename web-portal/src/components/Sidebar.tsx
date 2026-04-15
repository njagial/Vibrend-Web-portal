import React from 'react';
import { 
  LayoutGrid, 
  History, 
  Plane, 
  Car, 
  LifeBuoy, 
  LogOut 
} from 'lucide-react';
import '../css/Sidebar.css';

interface SidebarProps {
  activeTab: 'explore' | 'history' | 'flights' | 'cars';
  setTab: (tab: 'explore' | 'history' | 'flights' | 'cars') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setTab, onLogout }) => {
  return (
    <aside className="vertical-sidebar">
      <div className="sidebar-top-group">
        <button 
          className={`sidebar-btn ${activeTab === 'explore' ? 'active' : ''}`} 
          onClick={() => setTab('explore')}
          title="Explore"
        >
          <LayoutGrid size={22} />
          <span className="tooltip">Explore</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`} 
          onClick={() => setTab('history')}
          title="History"
        >
          <History size={22} />
          <span className="tooltip">History</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'flights' ? 'active' : ''}`} 
          onClick={() => setTab('flights')}
          title="Flights"
        >
          <Plane size={22} />
          <span className="tooltip">Flights</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'cars' ? 'active' : ''}`} 
          onClick={() => setTab('cars')}
          title="Car Rentals"
        >
          <Car size={22} />
          <span className="tooltip">Cars</span>
        </button>
      </div>

      <div className="sidebar-bottom-group">
        <a 
          href="https://wa.me/254746665338?text=Hello%20Vibrend%20Support,%20I%20need%20assistance." 
          target="_blank" 
          rel="noopener noreferrer"
          className="sidebar-link-wrapper"
        >
          <button className="sidebar-btn" title="Support">
            <LifeBuoy size={22} />
          </button>
        </a>
        <button className="sidebar-btn logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;