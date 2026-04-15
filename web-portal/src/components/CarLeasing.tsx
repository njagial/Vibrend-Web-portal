import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Smartphone, CheckCircle, ShieldCheck, ArrowLeft, Fuel, Gauge, Settings } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';
import { createBooking } from '../apis/booking';
import '../css/CarLeasing.css';

const API_BASE = import.meta.env.VITE_Backend_url;

const CarLeasing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'pending' | 'success' | 'failed'>(null);
  const [duration, setDuration] = useState(1); // Days to rent
  const [phoneNumber, setPhoneNumber] = useState("");


  const isValidPhone = /^254[17]\d{8}$/.test(phoneNumber);
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cars`);
        setCars(res.data);
      } catch (err) {
        console.error("Database error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  // Find the selected car safely
  const selectedCar = cars.find((c: any) => c._id === selectedId || c.id === selectedId);

 const handleLease = async () => {
  // 1. Validations
  if (!selectedCar || !isValidPhone) {
    alert("Please enter a valid M-Pesa number (254...)");
    return;
  }
  
  // 2. Calculate Total (Car usually just needs Price * Duration)
  const base = typeof selectedCar.pricePerDay === 'string' 
    ? parseInt(selectedCar.pricePerDay.replace(/[^0-9]/g, '')) 
    : selectedCar.pricePerDay;
    
  const total = base * duration;

  try {
    setIsPaying(true);
    setPaymentStatus('pending');

    // 3. Trigger STK Push
    const response = await initiatePayment(phoneNumber, total);
    
    if (response.CheckoutRequestID) {
      // 4. Polling for Result
      const interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(response.CheckoutRequestID);
          
          if (status.ResultCode === '0') {
            setPaymentStatus('success');
            setIsPaying(false);
            clearInterval(interval);

            // 5. Create Rental Record in Database
            await createBooking({
                carId: selectedCar._id.toString(),
                carModel: selectedCar.model,
                amount: total,
                duration: duration,
                phoneNumber: phoneNumber,
                type: 'car-rental', // Distinguish from tourism bookings
                status: 'confirmed'
            });
            alert("Car Rental Confirmed!");
          } 
          else if (status.ResultCode !== 'pending') {
            setPaymentStatus('failed');
            setIsPaying(false);
            clearInterval(interval);
            alert("Payment failed or cancelled.");
          }
        } catch (pollError) {
          console.error("Status check failed:", pollError);
        }
      }, 5000);
    }
  } catch (error) {
    console.error("Lease initiation error:", error);
    setPaymentStatus('failed');
    setIsPaying(false);
  }
};

  console.log("Selected Car:", selectedCar);

  // Determine which view to render
  const viewStatus = (selectedId && selectedCar) ? 'DETAILS' : loading ? 'LOADING' : 'GRID';

  const renderView = () => {
    switch (viewStatus) {
      case 'DETAILS':
        return (
          <div className="details-view fade-in-view">
            <button className="back-link" onClick={() => setSelectedId(null)}>
              <ArrowLeft size={18} /> Back to Fleet
            </button>
            
            <div className="details-layout">
              <div 
                className="hero-img" 
                style={{ backgroundImage: `url("${selectedCar.imageUrl}")` }} 
              />
              
              <div className="info-pane">
                <div className="info-head">
                  <h1>{selectedCar.model}</h1>
                  <span className="location-badge">{selectedCar.city}</span>
                </div>

                <div className="car-specs-row">
                  <div className="spec-item"><Fuel size={16}/> <span>Petrol</span></div>
                  <div className="spec-item"><Settings size={16}/> <span>Automatic</span></div>
                  <div className="spec-item"><Gauge size={16}/> <span>Unlimited Km</span></div>
                </div>

                <div className="preferences-section">
                  <div className="pref-group">
                    <label>M-Pesa Number</label>
                    <input 
                      type="tel" 
                      placeholder="254..." 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="total-price-display">
                    <span>Daily Rate:</span>
                    <span className="amount">Ksh {selectedCar.pricePerDay.toLocaleString()}</span>
                  </div>
                    <button
                      className="cta-button"
                      onClick={handleLease}
                      disabled={isPaying || paymentStatus === 'success'}
                    >
                      {isPaying 
                        ? 'Checking Payment...' 
                        : paymentStatus === 'success' 
                          ? 'Rental Confirmed ✅' 
                          : 'Confirm & Pay via M-Pesa'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'LOADING':
        return (
          <div className="car-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        );

     case 'GRID':
      default:
        return (
          <div className="car-leasing-section fade-in-view">
            <header className="leasing-header">
              <div>
                <h2 className="leasing-title">Vibrend Premium Fleet</h2>
                <p className="leasing-subtitle">Handpicked rentals for your journey</p>
              </div>
            </header>

            <div className="car-grid">
              {cars.map((car: any) => {
                // 1. Sanitize the URL (handles the naming mismatch and trailing quotes)
                // Ensure we check both image_url and imageUrl just in case
                const rawUrl = car.imageUrl;
                const cardImage = rawUrl?.replace(/[\\"]+$/, '');

                return (
                  <div key={car._id} className="car-card" onClick={() => setSelectedId(car._id)}>
                    <div 
                      className="car-image-box" 
                      style={{ 
                        backgroundImage: cardImage ? `url("${cardImage}")` : 'none',
                        // Use 'contain' to show the whole car, 'cover' if you want it to fill the box
                        backgroundSize: 'contain', 
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: '180px', // Slightly shorter for better card proportions
                        padding: '20px',  // Frames the car so it doesn't touch the edges
                        backgroundColor: '#f8fafc' // Light matte background for the frame
                      }}
                    >
                      {!cardImage && <Car size={40} color="#cbd5e1" />}
                    </div>

                    <div className="car-info">
                      <div className="car-meta">
                        <span>{car.provider}</span>
                        <span className="dot">•</span>
                        <span>{car.city}</span>
                      </div>
                      <h3>{car.model}</h3>
                    </div>

                    <div className="car-card-footer">
                      <div className="price-tag">
                        <span className="amount">Ksh {car.pricePerDay?.toLocaleString()}</span>
                        <span className="currency">per day</span>
                      </div>
                      <div className="view-details-pill" style={{ width: '100%', textAlign: 'center' }}>
                        Rent Now
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return <>{renderView()}</>;
};

export default CarLeasing;