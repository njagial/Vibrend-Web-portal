import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import CarLeasing from './CarLeasing.tsx';  
import DestinationsView from './DestinationsView.tsx';
import HistoryView from './HistoryView.tsx';
import Sidebar from './Sidebar.tsx';
import Navbar from './NavBar.tsx';
import FlightView from './FlightView.tsx';



const Dashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'explore' | 'history' | 'flights' | 'cars'>('explore');
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper">
      <Navbar activeTab={currentTab} setActiveTab={setCurrentTab} />
      
      <div className="app-body">
        <Sidebar activeTab={currentTab} setTab={setCurrentTab} onLogout={() => navigate('/login')} />
        
        <main className="main-content">
          {currentTab === 'explore' && <DestinationsView />}          
          {currentTab === 'history' && <HistoryView />}
          {currentTab === 'flights' && <FlightView />}
          {currentTab === 'cars' && <CarLeasing />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;