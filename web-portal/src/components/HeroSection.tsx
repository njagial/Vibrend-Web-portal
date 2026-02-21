import { useState } from 'react';
import '../css/HeroSection.css';

export default function HeroSection() {
  const [destination, setDestination] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [guests, setGuests] = useState('1');

  const handleSearch = () => {
    console.log('Searching for:', { destination, dateFrom, dateTo, guests });
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text">
          <h1 className="hero-title">Discover Your Next Adventure</h1>
          <p className="hero-subtitle">
            Explore amazing destinations and create unforgettable memories
          </p>
        </div>

        <div className="search-box">
          <div className="search-grid">
            <div className="search-field">
              <label className="search-label">Where to?</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destinations..."
                className="search-input"
              />
            </div>

            <div className="search-field">
              <label className="search-label">Check-in</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-field">
              <label className="search-label">Check-out</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-field">
              <label className="search-label">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="search-select"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <button onClick={handleSearch} className="search-btn">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}