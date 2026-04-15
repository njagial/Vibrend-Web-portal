import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plane, Clock, ArrowRight } from 'lucide-react';
import { searchFlights } from '../apis/flights-api.ts'; 
import SkeletonCard from './SkeletonCard';
import '../css/FlightView.css'; // Import the new CSS file

const FlightView: React.FC = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [flightQuery, setFlightQuery] = useState({
    origin: 'NBO',
    destination: 'DXB',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const getAirlineLetter = (name: string) => name.charAt(0).toUpperCase();
  const getAirlineColorClass = (name: string) => `color-type-${name.length % 5}`;

  const handleFlightSearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchFlights(flightQuery);
      setFlights(data);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [flightQuery]);

  useEffect(() => { handleFlightSearch(); }, []);

  return (
    <div className="fv-container">
      <header className="fv-header">
        <h2 className="fv-title">Air Travel</h2>
        <p className="fv-subtitle">Premium flight connections for Vibrend Fleet</p>
      </header>

      <section className="fv-search-bar">
        <div className="fv-input-group">
          <label>Origin</label>
          <input 
            value={flightQuery.origin} 
            onChange={(e) => setFlightQuery({...flightQuery, origin: e.target.value.toUpperCase()})}
          />
        </div>
        <div className="fv-input-group">
          <label>Destination</label>
          <input 
            value={flightQuery.destination} 
            onChange={(e) => setFlightQuery({...flightQuery, destination: e.target.value.toUpperCase()})}
          />
        </div>
        <div className="fv-input-group">
          <label>Departure Date</label>
          <input 
            type="date"
            value={flightQuery.date} 
            onChange={(e) => setFlightQuery({...flightQuery, date: e.target.value})}
          />
        </div>
        <button className="fv-search-btn" onClick={handleFlightSearch}>
          <Search size={20} />
        </button>
      </section>

      <main className="fv-results-list">
        {loading ? (
          [1, 2, 3, 4].map(n => <SkeletonCard key={n} />)
        ) : flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight.id} className="fv-card">
              
              <div className="fv-airline-section">
                <div className={`fv-avatar ${getAirlineColorClass(flight.airline)}`}>
                  {getAirlineLetter(flight.airline)}
                </div>
                <div className="fv-airline-details">
                  <span className="fv-airline-name">{flight.airline}</span>
                  <span className="fv-flight-no">{flight.flightNumber || 'INTL'}</span>
                </div>
              </div>

              <div className="fv-path-section">
                <div className="fv-time-block">
                  <span className="fv-time">{new Date(flight.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="fv-iata">{flight.departure_iata}</span>
                </div>

                <div className="fv-path-visual">
                  <div className="fv-duration">
                    <Clock size={12} />
                    <span>{flight.duration || '5h 20m'}</span>
                  </div>
                  <div className="fv-line-container">
                    <div className="fv-dot fv-dot-start"></div>
                    <Plane size={14} className="fv-plane-icon" />
                    <div className="fv-dot fv-dot-end"></div>
                  </div>
                </div>

                <div className="fv-time-block text-right">
                  <span className="fv-time">{new Date(flight.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="fv-iata">{flight.arrival_iata}</span>
                </div>
              </div>

              <div className="fv-price-section">
                <div className="fv-price-info">
                  <span className="fv-price-label">Economy</span>
                  <span className="fv-amount">
                    <small>KES</small> {(parseFloat(flight.price) * 145).toLocaleString()}
                  </span>
                </div>
                <button className="fv-select-btn" onClick={() => {}}>
                  <ArrowRight size={20} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="fv-empty-state">No flights found.</div>
        )}
      </main>
    </div>
  );
};

export default FlightView;