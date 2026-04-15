import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { fetchDestinations, type Destination } from '../apis/destinations-api';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';
import { createBooking } from '../apis/booking';
import SkeletonCard from './SkeletonCard';
import '../css/DestinationsView.css';

const DestinationsView: React.FC = () => {
  // --- STATE ---
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'pending' | 'success' | 'failed'>(null);
  const [numPeople, setNumPeople] = useState(1);
  const [duration, setDuration] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

  // --- API LOAD ---
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
 console.log("Fetched Destinations:", destinations);
  // --- DERIVED LOGIC ---
  const isValidPhone = /^254[17]\d{8}$/.test(phoneNumber);
  
  const selectedDestination = destinations.find(d => 
    selectedId !== null && String(d.id) === String(selectedId)
  );

  // Status Enumeration for the Switch Case
  const viewStatus = (selectedId && selectedDestination) 
    ? 'DETAILS' 
    : loading 
      ? 'LOADING' 
      : 'GRID';

  const handlePayment = async () => {
    if (!selectedDestination || !isValidPhone) {
      alert("Please enter a valid M-Pesa number (254...)");
      return;
    }
    
    const base = parseInt(selectedDestination.price?.replace(/[^0-9]/g, '') || "0");
    const total = base * numPeople * duration * 129;

    try {
      setIsPaying(true);
      setPaymentStatus('pending');
      const response = await initiatePayment(phoneNumber, total);
      
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
                amount: total,
                people: numPeople,
                duration: duration,
                phoneNumber: phoneNumber,
                status: 'confirmed'
            });
            alert("Booking Confirmed!");
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

  // --- RENDERER ---
  const renderView = () => {
    switch (viewStatus) {
      case 'DETAILS':
        console.log("Full Destination Object:", selectedDestination);
        // Calculate price only when we are strictly in this view
        // 1. Get the price string safely (fallback to empty string if missing)
      const rawPrice = selectedDestination?.price || "";

      // 2. Only attempt to replace if rawPrice actually has content
      const basePrice = rawPrice 
        ? parseInt(rawPrice.replace(/[^0-9]/g, '')) 
        : 0;

      // 3. Final total (guaranteed to be a number)
      const totalPrice = (basePrice || 0) * numPeople * duration * 129; // 129 is the M-Pesa multiplier for the service fee

        return (
          <div className="details-view fade-in-view">
            <button className="back-link" onClick={() => setSelectedId(null)}>
              <ArrowLeft size={18} /> Back to Search
            </button>
            <div className="details-layout">
              <div className="hero-img" style={{ backgroundImage: `url(${selectedDestination!.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px', 
                borderRadius: '12px' }} />
              <div className="info-pane">
                <div className="info-head">
                  <h1>{selectedDestination!.title}</h1>
                  <span className="price-badge">{selectedDestination!.price}</span>
                </div>
                <p className="desc-text">{selectedDestination!.description}</p>
                
                <div className="preferences-section">
                  <h3>Trip Preferences</h3>
                  <div className="pref-group">
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
                    <div className="pref-row" style={{  gap: '20px' }}>
                      <div className="pref-group">
                        <label>Days</label>
                          <div className="counter-input">
                            <button onClick={() => setDuration(Math.max(1, duration - 1))}>-</button>
                              <span>{duration}</span>
                            <button onClick={() => setDuration(duration + 1)}>+</button>
                          </div>
                      </div>
                      <div className="total-price-display">
                        <span>Total:</span>
                        <span className="amount">ksh {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                <button
                  className="cta-button"
                  onClick={handlePayment}
                  disabled={isPaying || paymentStatus === 'success'}
                >
                  {isPaying ? 'Processing...' : paymentStatus === 'success' ? 'Confirmed ✅' : 'Confirm Booking'}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        );

      case 'LOADING':
        return (
          <div className="grid-view">
            <h2 className="page-title">Finding adventures...</h2>
            <div className="card-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
            </div>
          </div>
        );

      case 'GRID':
      default:
        const filtered = destinations.filter(d => 
          d.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="grid-view fade-in-view">
            <div className="view-header-row">
              <div className="header-text">
                <h2 className="page-title">Explore Destinations</h2>
                <p className="page-subtitle">Handpicked escapes across East Africa.</p>
              </div>
              <div className="inline-search">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Where to next?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
    
            <div className="card-grid">
              {filtered.map((dest) => (
                <div 
                  key={dest.id} 
                  className="dest-card" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedId(dest.id);
                  }}
                >
                  <div className="card-image-wrapper">
                    <img 
                      src={dest.image_url || 'https://via.placeholder.com/400x300'} 
                      alt={dest.title} 
                      className="card-image" 
                    />
                    <div className="card-category-tag">
                      {dest.location?.split(',')[0] || "Travel"}
                    </div>
                  </div>
                  <div className="card-footer">
                    <h3 className="card-name">{dest.title}</h3>
                    <div className="card-meta">
                      <span className="card-price">
                        {typeof dest.price === 'number' 
                          ? (dest.price * 129).toLocaleString() 
                          : (parseFloat(dest.price.replace(/[$,]/g, '')) * 129).toLocaleString()}
                        <small className="currency-label"> KES</small>
                      </span>
                      <span className="card-dot">•</span>
                      <span className="card-duration">Per Day</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return <>{renderView()}</>;
};

export default DestinationsView;