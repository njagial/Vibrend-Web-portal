import { useState, useEffect } from 'react';
import axios from 'axios';
import { Car as CarIcon, ArrowLeft, Fuel, Gauge, Settings } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import { initiatePayment, checkPaymentStatus } from '../apis/payment-api';
import { createBooking } from '../apis/booking';
import '../css/CarLeasing.css';

// 1. DEFINE THE INTERFACE (This fixes the 'never' and 'undefined' errors)
interface Car {
  _id: string;
  id?: string;
  model: string;
  imageUrl: string;
  city: string;
  pricePerDay: number | string;
  provider: string;
}

const API_BASE = import.meta.env.VITE_Backend_url;

const CarLeasing = () => {
  // 2. USE THE INTERFACE IN STATE
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'pending' | 'success' | 'failed'>(null);
  const [duration] = useState(1); // Since setDuration was unused, I removed it to fix TS6133
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

  // 3. SAFE ACCESS (The '?' prevents "Possibly Undefined" errors)
  const selectedCar = cars.find((c) => c._id === selectedId || c.id === selectedId);

  const handleLease = async () => {
    if (!selectedCar || !isValidPhone) {
      alert("Please enter a valid M-Pesa number (254...)");
      return;
    }
    
    // Convert price string/number safely
    const base = typeof selectedCar.pricePerDay === 'string' 
      ? parseInt(selectedCar.pricePerDay.replace(/[^0-9]/g, '')) 
      : (selectedCar.pricePerDay as number);
      
    const total = base * duration;

    try {
      setIsPaying(true);
      setPaymentStatus('pending');

      const response = await initiatePayment(phoneNumber, total);
      
      if (response.CheckoutRequestID) {
        const interval = setInterval(async () => {
          try {
            const status = await checkPaymentStatus(response.CheckoutRequestID);
            
            if (status.ResultCode === '0') {
              setPaymentStatus('success');
              setIsPaying(false);
              clearInterval(interval);
              alert("Payment successful! Your car rental is confirmed.");} 
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

  const viewStatus = (selectedId && selectedCar) ? 'DETAILS' : loading ? 'LOADING' : 'GRID';

  const renderView = () => {
    switch (viewStatus) {
      case 'DETAILS':
        // Use Optional Chaining (?.) for all selectedCar properties
        return (
          <div className="details-view fade-in-view">
            <button className="back-link" onClick={() => setSelectedId(null)}>
              <ArrowLeft size={18} /> Back to Fleet
            </button>
            
            <div className="details-layout">
              <div 
                className="hero-img" 
                style={{ backgroundImage: `url("${selectedCar?.imageUrl}")` }} 
              />
              
              <div className="info-pane">
                <div className="info-head">
                  <h1>{selectedCar?.model}</h1>
                  <span className="location-badge">{selectedCar?.city}</span>
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
                    <span className="amount">Ksh {selectedCar?.pricePerDay?.toLocaleString()}</span>
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
              {cars.map((car: Car) => {
                const cardImage = car.imageUrl?.replace(/[\\"]+$/, '');
                return (
                  <div key={car._id} className="car-card" onClick={() => setSelectedId(car._id)}>
                    <div 
                      className="car-image-box" 
                      style={{ 
                        backgroundImage: cardImage ? `url("${cardImage}")` : 'none',
                        backgroundSize: 'contain', 
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: '180px',
                        padding: '20px',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      {!cardImage && <CarIcon size={40} color="#cbd5e1" />}
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
                      <div className="view-details-pill">
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