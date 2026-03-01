import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import { 
  Home, Search, User, FileText, Bed, Plane, 
  Car, LifeBuoy, ArrowLeft
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import { fetchDestinations, type Destination } from '../apis/destinations-api';
import { useNavigate } from 'react-router-dom';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';
import { createBooking, fetchMyBookings, type Booking } from '../apis/booking';
import { Trash2 } from 'lucide-react';
import { deleteBooking } from '../apis/booking';

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
  const [currentTab, setCurrentTab] = useState<'explore' | 'history'>('explore');

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

  const handleDelete = async (id: string) => {
  if (window.confirm("Are you sure you want to remove this booking from your history?")) {
    await deleteBooking(id);
    // Refresh the list after deletion
    const updatedBookings = await fetchMyBookings();
    setBookings(updatedBookings);
  }
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
      <header className="horizontal-header">
        <div className="nav-icon" onClick={() => { setCurrentTab('explore'); setSelectedId(null); }}><Home size={24} /></div>
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
        <aside className="vertical-sidebar">
          <button className={`sidebar-btn ${currentTab === 'explore' ? 'active' : ''}`} onClick={() => setCurrentTab('explore')}>
            <Bed size={22} />
          </button>
          <button className={`sidebar-btn ${currentTab === 'history' ? 'active' : ''}`} onClick={() => setCurrentTab('history')}>
            <FileText size={22} />
          </button>
          <button className="sidebar-btn"><Plane size={22} /></button>
          <button className="sidebar-btn"><Car size={22} /></button>
          <button className="sidebar-btn"><LifeBuoy size={22} /></button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
            <LogOut size={22} />
          </button>
        </aside>

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
          ) : (
            /* --- GRID VIEW --- */
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
  );
};

export default Dashboard;