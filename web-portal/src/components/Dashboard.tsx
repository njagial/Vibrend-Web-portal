import React, { useState, useEffect, useCallback } from 'react';
import '../css/Dashboard.css';
import { 
  Home, Search, User, FileText, Bed, Plane, 
  Car, LifeBuoy, ArrowLeft,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowRight
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import { fetchDestinations, type Destination } from '../apis/destinations-api';
import { useNavigate } from 'react-router-dom';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';
import { createBooking, fetchMyBookings, type Booking } from '../apis/booking';
import { Trash2 } from 'lucide-react';
import { deleteBooking } from '../apis/booking';
import { fetchFlights, type FlightOffer } from '../apis/amadeus-api.ts';
import CarLeasing from './CarLeasing.tsx';  


const Dashboard: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'pending' | 'success' | 'failed'>(null);
  const [numPeople, setNumPeople] = useState(1);
  const [duration, setDuration] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentTab, setCurrentTab] = useState<'explore' | 'history' | 'flights'| 'cars'>('explore');
  // State for flight results and search criteria
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [flightQuery, setFlightQuery] = useState({
    origin: 'NBO',
    dest: 'DXB',
    date: new Date().toISOString().split('T')[0] // Default to today
  });

  const navigate = useNavigate();

  const isValidPhone = /^254[17]\d{8}$/.test(phoneNumber);

  const handleLogout = () => {
  // Clear any tokens or session data
  localStorage.removeItem('token'); 
  navigate('/login');
};

  // Load Destinations
  useEffect(() => {
    const getDestinations = async () => {
      try {
        setLoading(true);
        const data = await fetchDestinations();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("API Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getDestinations();
  }, []);

  // Load History when tab changes
  useEffect(() => {
    if (currentTab === 'history') {
      const getHistory = async () => {
        try {
          const data = await fetchMyBookings();
          setBookings(data);
        } catch (error) {
          console.error("Error fetching history:", error);
        }
      };
      getHistory();
    }
  }, [currentTab]);

  const handleFlightSearch = useCallback(async () => {
    setLoading(true);
    try {
      // Calling your dedicated API file
      const data = await fetchFlights(flightQuery.origin, flightQuery.dest, flightQuery.date);
      setFlights(data);
    } catch (error) {
      console.error("Flight search failed", error);
    } finally {
      setLoading(false);
    }
  }, [flightQuery]);

  // This ensures the search runs when the user first opens the tab
  useEffect(() => {
    if (currentTab === 'flights' && flights.length === 0) {
      handleFlightSearch();
    }
  }, [currentTab, flights.length, handleFlightSearch]);


  const handleDelete = async (id: string) => {
  if (window.confirm("Are you sure you want to remove this booking from your history?")) {
    await deleteBooking(id);
    // Refresh the list after deletion
    const updatedBookings = await fetchMyBookings();
    setBookings(updatedBookings);
  }
};

  const handleSelectFlight = (flight: any) => {
  const priceKES = Math.round(parseFloat(flight.price.total) * 132);
  // We temporarily "mock" a destination object so the Details/Payment view works
  const mockFlightDest = {
    id: flight.id,
    title: `${flight.validatingAirlineCodes[0]} Flight: ${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[0].arrival.iataCode}`,
    price: `Ksh ${priceKES.toLocaleString()}`,
    description: "International Flight Ticket",
    image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=1000",
    location: "Global"
  };
  
  // Set the "virtual" destination and switch view to 'details'
  // (You might need to adjust your state logic slightly to handle this)
  setDestinations([mockFlightDest, ...destinations]); 
  setSelectedId(flight.id);
  setCurrentTab('explore'); // Switches back to details view
};

  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const filteredDestinations = safeDestinations.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDestination = safeDestinations.find(d => d.id === selectedId);
  const basePrice = selectedDestination ? parseInt(selectedDestination.price.replace(/[^0-9]/g, '')) : 0;
  const totalPrice = basePrice * numPeople * duration;

  const handlePayment = async () => {
    if (!selectedDestination || !isValidPhone) {
      alert("Please enter a valid M-Pesa number (254...)");
      return;
    }
    try {
      setIsPaying(true);
      setPaymentStatus('pending');
      const response = await initiatePayment(phoneNumber, totalPrice);
      
      if (response.CheckoutRequestID) {
        const interval = setInterval(async () => {
          const status = await checkPaymentStatus(response.CheckoutRequestID);
          
          if (status.ResultCode === '0') {
            setPaymentStatus('success');
            setIsPaying(false);
            clearInterval(interval);

            await createBooking({
                destinationId: selectedDestination.id.toString(),
                destinationTitle: selectedDestination.title,
                amount: totalPrice,
                people: numPeople,
                duration: duration,
                phoneNumber: phoneNumber,
                status: 'confirmed'
            });
            alert("Booking Confirmed and Saved!");
          } else if (status.ResultCode !== 'pending') {
            setPaymentStatus('failed');
            setIsPaying(false);
            clearInterval(interval);
          }
        }, 5000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setIsPaying(false);
    }
  };

  return (
    <div className="layout-wrapper">
      {/* --- HEADER --- */}
      <header className="horizontal-header">
        <div className="nav-icon" onClick={() => { setCurrentTab('explore'); setSelectedId(null); }}>
          <Home size={24} />
        </div>
        <div className="search-bar-container">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search destination..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-icon" onClick={() => navigate('/profile')}><User size={24} /></div>
      </header>

      <div className="app-body">
        {/* --- SIDEBAR --- */}
        <aside className="vertical-sidebar">
          <button className={`sidebar-btn ${currentTab === 'explore' ? 'active' : ''}`} onClick={() => {setCurrentTab('explore'); setSelectedId(null);}}>
            <Bed size={22} />
          </button>
          <button className={`sidebar-btn ${currentTab === 'history' ? 'active' : ''}`} onClick={() => setCurrentTab('history')}>
            <FileText size={22} />
          </button>
          <button className={`sidebar-btn ${currentTab === 'flights' ? 'active' : ''}`} onClick={() => setCurrentTab('flights')}>
            <Plane size={22} />
          </button>
          <button 
            className={`sidebar-btn ${currentTab === 'cars' ? 'active' : ''}`} 
            onClick={() => { setCurrentTab('cars'); setSelectedId(null); }}
          >
            <Car size={22} />
          </button>          
          <button className="sidebar-btn"><LifeBuoy size={22} /></button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
            <LogOut size={22} />
          </button>
        </aside>

        {/* --- MAIN CONTENT --- */}
          <main className="main-content">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Connecting to servers...</p>
            </div>

          ) : currentTab === 'history' ? (
            /* --- HISTORY VIEW --- */
              <div className="history-view">
                <h2 className="page-title">My Booking History</h2>
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th>Guests</th>
                        <th>Duration</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>

                      {bookings.length > 0 ? (
                        bookings.map((b, i) => (
                          <tr key={b.id || i} className="history-row">
                            <td className="dest-cell">
                              <span className="dest-title">{b.destinationTitle}</span>
                              <span className="dest-date">
                                {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </td>
                            <td>{b.people}</td>
                            <td>{b.duration} Nights</td>
                            <td className="amount-cell">$ {b.amount.toLocaleString()}</td>
                            <td>
                              <span className={`status-pill ${b.status.toLowerCase()}`}>
                                {b.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => b.id && handleDelete(b.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="empty-row-cell">
                            No bookings found. Start exploring!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          ) : selectedDestination ? (
            /* --- DETAILS VIEW --- */
            <div className="details-view">
              <button className="back-link" onClick={() => setSelectedId(null)}>
                <ArrowLeft size={18} /> Back to Search
              </button>
              <div className="details-layout">
                <div className="hero-img" style={{ backgroundImage: `url(${selectedDestination.image_url})` }} />
                <div className="info-pane">
                  <div className="info-head">
                    <h1>{selectedDestination.title}</h1>
                    <span className="price-badge">{selectedDestination.price}</span>
                  </div>
                  <p className="desc-text">{selectedDestination.description}</p>
                  <div className="preferences-section">
                    <h3>Trip Preferences</h3>
                    <div className="pref-group phone-group">
                      <label>M-Pesa Number</label>
                      <input
                        type="tel"
                        placeholder="2547XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className={phoneNumber && !isValidPhone ? 'error' : ''}
                      />
                    </div>
                    <div className="pref-group">
                      <label>Guests</label>
                      <div className="counter-input">
                        <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))}>-</button>
                        <span>{numPeople}</span>
                        <button onClick={() => setNumPeople(numPeople + 1)}>+</button>
                      </div>
                    </div>
                    <div className="pref-group">
                      <label>Nights</label>
                      <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                        {[1, 2, 3, 5, 7, 10].map(n => <option key={n} value={n}>{n} Nights</option>)}
                      </select>
                    </div>
                    <div className="total-price-display">
                      <span>Total:</span>
                      <span className="amount">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    className={`cta-button ${isPaying ? 'loading' : ''}`}
                    onClick={handlePayment}
                    disabled={isPaying || paymentStatus === 'success'}
                  >
                    {isPaying ? 'Processing...' : paymentStatus === 'success' ? 'Confirmed ✅' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          ) : currentTab === 'flights' ? (
              <div className="flights-view-wrapper">
                <div className="view-header">
                  <h2 className="page-title">Air Travel</h2>
                  <p className="page-subtitle">Real-time flight offers via Amadeus</p>
                </div>

                {/* 1. Search Toolbar */}
                <div className="flight-search-toolbar">
                  <div className="search-input-group">
                    <label>Origin (IATA)</label>
                    <input 
                      type="text" 
                      value={flightQuery.origin} 
                      onChange={(e) => setFlightQuery({...flightQuery, origin: e.target.value.toUpperCase()})}
                      placeholder="NBO"
                    />
                  </div>
                  <div className="search-input-group">
                    <label>Destination</label>
                    <input 
                      type="text" 
                      value={flightQuery.dest} 
                      onChange={(e) => setFlightQuery({...flightQuery, dest: e.target.value.toUpperCase()})}
                      placeholder="DXB"
                    />
                  </div>
                  <div className="search-input-group">
                    <label>Departure Date</label>
                    <input 
                      type="date" 
                      value={flightQuery.date} 
                      onChange={(e) => setFlightQuery({...flightQuery, date: e.target.value})}
                    />
                  </div>
                  <button className="search-btn" onClick={handleFlightSearch}>
                    <Search size={18} /> Search
                  </button>
                </div>

                {/* 2. Mapping the Results */}
                <div className="flight-results-grid">
                  {flights.length > 0 ? (
                    flights.map((flight) => {
                      const itinerary = flight.itineraries[0];
                      const segment = itinerary.segments[0];
                      const airlineCode = flight.validatingAirlineCodes[0];

                      return (
                        <div key={flight.id} className="flight-card-modern">
                          <div className="card-top">
                            <div className="airline-info">
                              <img 
                                src={`https://id90travel.com/images/airlines/${airlineCode}.png`} 
                                alt={airlineCode} 
                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/30?text=✈️'}
                              />
                              <span>{airlineCode} Airways</span>
                            </div>
                            <div className="price-tag">
                              Ksh {(parseFloat(flight.price.total) * 128).toLocaleString()}
                            </div>
                          </div>

                          <div className="flight-main-path">
                            <div className="path-node">
                              <strong>{segment.departure.iataCode}</strong>
                              <span>{new Date(segment.departure.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            
                            <div className="path-divider">
                              <span className="duration-label">{itinerary.duration.replace('PT', '').toLowerCase()}</span>
                              <div className="line-with-plane">
                                <Plane size={14} />
                              </div>
                            </div>

                            <div className="path-node">
                              <strong>{segment.arrival.iataCode}</strong>
                              <span>{new Date(segment.arrival.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>

                          <button className="select-flight-btn" onClick={() => handleSelectFlight(flight)}>
                            Select Flight
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-results-state">
                      <Plane size={40} />
                      <p>No flights found for this route. Try a different date.</p>
                    </div>
                  )}
                </div>
              </div>
      ) : currentTab === 'cars' ? (
        <CarLeasing />
      ) : (
              /* --- 4. DEFAULT EXPLORE GRID --- */
            <div className="grid-view">
              <h2 className="page-title">Explore Destinations</h2>
              <div className="card-grid">
                {filteredDestinations.map((dest) => (
                  <div key={dest.id} className="dest-card" onClick={() => setSelectedId(dest.id)}>
                    <div className="card-image-box" style={{ backgroundImage: `url(${dest.image_url})` }} />
                    <div className="card-footer">
                      <p className="card-name">{dest.title}</p>
                      <p className="card-loc">{dest.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );}

export default Dashboard;