import React, { useState } from 'react';
import '../css/Dashboard.css';
import { 
  Home, Search, User, FileText, Bed, Plane, 
  Car, LifeBuoy, ArrowLeft, MapPin, Star 
} from 'lucide-react';

interface Destination {
  id: number;
  title: string;
  location: string;
  description: string;
  price: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const destinations: Destination[] = [
    { id: 1, title: "Amalfi Coast", location: "Italy", price: "$450", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", description: "Breath-taking coastal views and colorful villages." },
    { id: 2, title: "Kyoto Temple", location: "Japan", price: "$320", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", description: "Serene traditional architecture and zen gardens." },
    { id: 3, title: "Santorini", location: "Greece", price: "$500", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80", description: "Iconic white buildings and stunning sunsets." },
    { id: 4, title: "Swiss Alps", location: "Switzerland", price: "$600", image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80", description: "World-class skiing and mountain air." },
    { id: 5, title: "Bora Bora", location: "Polynesia", price: "$850", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", description: "Crystal clear lagoons and overwater bungalows." },
    { id: 6, title: "Grand Canyon", location: "USA", price: "$200", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80", description: "A vast, awe-inspiring natural wonder." },
  ];

  const filteredDestinations = destinations.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDestination = destinations.find(d => d.id === selectedId);

  return (
    <div className="layout-wrapper">
      <header className="horizontal-header">
        <div className="nav-icon" onClick={() => setSelectedId(null)}><Home size={24} /></div>
        <div className="search-bar-container">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search destination..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-icon"><User size={24} /></div>
      </header>

      <div className="app-body">
        <aside className="vertical-sidebar">
          {[FileText, Bed, Plane, Car, LifeBuoy].map((Icon, idx) => (
            <button key={idx} className="sidebar-btn"><Icon size={22} /></button>
          ))}
        </aside>

        <main className="main-content">
          {!selectedDestination ? (
            <div className="grid-view">
              <h2 className="page-title">Explore Destinations</h2>
              <div className="card-grid">
                {filteredDestinations.map((dest) => (
                  <div key={dest.id} className="dest-card" onClick={() => setSelectedId(dest.id)}>
                    <div className="card-image-box" style={{ backgroundImage: `url(${dest.image})` }} />
                    <div className="card-footer">
                      <p className="card-name">{dest.title}</p>
                      <p className="card-loc">{dest.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="details-view">
              <button className="back-link" onClick={() => setSelectedId(null)}>
                <ArrowLeft size={18} /> Back to Search
              </button>
              <div className="details-layout">
                <div className="hero-img" style={{ backgroundImage: `url(${selectedDestination.image})` }} />
                <div className="info-pane">
                  <div className="info-head">
                    <h1>{selectedDestination.title}</h1>
                    <span className="price-badge">{selectedDestination.price}</span>
                  </div>
                  <p className="desc-text">{selectedDestination.description}</p>
                  <button className="cta-button">Confirm Booking</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;