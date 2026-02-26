import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import { 
  Home, Search, User, FileText, Bed, Plane, 
  Car, LifeBuoy, ArrowLeft, MapPin, Star 
} from 'lucide-react';
import { fetchDestinations, type Destination } from '../apis/destinations-api';
import { useNavigate } from 'react-router-dom';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';

const Dashboard: React.FC = () => {
  // 1. Initialize destinations as an empty array
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'pending' | 'success' | 'failed'>(null);
  const [numPeople, setNumPeople] = useState(1);
  const [duration, setDuration] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

// Simple validation to check if it's a valid Safaricom format
const isValidPhone = /^254[17]\d{8}$/.test(phoneNumber);

  // 2. Fetch data from API on component mount
  useEffect(() => {
  const getDestinations = async () => {
    try {
      setLoading(true);
      const data = await fetchDestinations();
      
      // DEBUG LOGS - Check your console for these!
      console.log("RAW API DATA:", data);
      console.log("DATA TYPE:", typeof data);
      console.log("IS ARRAY?:", Array.isArray(data));

      if (Array.isArray(data)) {
        setDestinations(data);
      } else {
        // If it's not an array, we log it and set an empty list to prevent the crash
        console.error("Expected array but got:", data);
        setDestinations([]); 
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  getDestinations();
}, []);

  // 3. Logic stays the same, now using the state 'destinations'
// This ensures that even if 'destinations' is null/undefined, the app won't turn black
const safeDestinations = Array.isArray(destinations) ? destinations : [];

const filteredDestinations = safeDestinations.filter(d => 
  d.title?.toLowerCase().includes(searchQuery.toLowerCase())
);

const handlePayment = async () => {
  if (!selectedDestination || !isValidPhone) {
    alert("Please enter a valid M-Pesa number (254...)");
    return;
  }

  try {
    setIsPaying(true);
    setPaymentStatus('pending');

    // Use the dynamic phone and total price
    const response = await initiatePayment(phoneNumber, 129*totalPrice);

    if (response.CheckoutRequestID) {
      // 2. Start checking status every 5 seconds
      const interval = setInterval(async () => {
      const status = await checkPaymentStatus(response.CheckoutRequestID);
        
        if (status.ResultCode === '0') { // Success code for most APIs
          setPaymentStatus('success');
          setIsPaying(false);
          clearInterval(interval);
        } else if (status.ResultCode !== 'pending') {
          setPaymentStatus('failed');
          setIsPaying(false);
          clearInterval(interval);
        }
      }, 5000);
    }
  } catch (error) {
    console.error("Payment Error:", error);
    setPaymentStatus('failed');
    setIsPaying(false);
  }
};

// Use safeDestinations here too
const selectedDestination = safeDestinations.find(d => d.id === selectedId);

const basePrice = selectedDestination 
  ? parseInt(selectedDestination.price.replace(/[^0-9]/g, '')) 
  : 0;
const totalPrice = basePrice * numPeople * duration;

  return (
    <div className="layout-wrapper">
      <header className="horizontal-header">
        <div className="nav-icon" onClick={() => navigate('/dashboard')}><Home size={24} /></div>
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
          {[FileText, Bed, Plane, Car, LifeBuoy].map((Icon, idx) => (
            <button key={idx} title={Icon.displayName || 'Navigation'} className="sidebar-btn"><Icon size={22} /></button>
          ))}
        </aside>

        <main className="main-content">
          {loading ? (
            <div className="loading-state">Loading destinations...</div>
          ) : !selectedDestination ? (
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
          ) : (
            <div className="details-view">
              <button className="back-link" onClick={() => setSelectedId(null)}>
                <ArrowLeft size={18} /> Back to Search
              </button>
              <div className="details-layout">
                <div className="hero-img" style={{ backgroundImage: `url(${selectedDestination.image_url
                })` }} />
                <div className="info-pane">
                  <div className="info-head">
                    <h1>{selectedDestination.title}</h1>
                    <span className="price-badge">{selectedDestination.price}</span>
                  </div>
                  <p className="desc-text">{selectedDestination.description}</p>
                  <div className="preferences-section">
                    <div className="pref-group phone-group">
                      <label>M-Pesa Number</label>
                      <div className="input-wrapper">
                        <input 
                          type="tel" 
                          placeholder="2547XXXXXXXX" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                          className={phoneNumber && !isValidPhone ? 'error' : ''}
                        />
                        {!isValidPhone && phoneNumber.length > 0 && (
                          <span className="input-hint">Format: 254XXXXXXXXX</span>
                        )}
                      </div>
                    </div>
                  <h3>Trip Preferences</h3>
                  <div className="pref-group">
                    <label>Number of People</label>
                    <div className="counter-input">
                      <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))}>-</button>
                      <span>{numPeople}</span>
                      <button onClick={() => setNumPeople(numPeople + 1)}>+</button>
                    </div>
                  </div>

                  <div className="pref-group">
                    <label htmlFor="duration-select">Duration (Nights)</label>
                    <select 
                      id="duration-select"
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="duration-select"
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="total-price-display">
                    <span>Total to Pay:</span>
                    <span className="amount">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                  
                  {/* Dynamic Payment Button */}
                  <button 
                    className={`cta-button ${isPaying ? 'loading' : ''}`} 
                    onClick={handlePayment}
                    disabled={isPaying || paymentStatus === 'success'}
                  >
                    {isPaying ? 'Processing STK Push...' : 
                    paymentStatus === 'success' ? 'Booking Confirmed! ✅' : 
                    'Confirm Booking'}
                  </button>

                  {paymentStatus === 'pending' && (
                    <p className="payment-hint">Please check your phone to enter your M-Pesa PIN.</p>
                  )}
                  {paymentStatus === 'failed' && (
                    <p className="payment-error">Payment failed or was cancelled. Try again.</p>
                  )}
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