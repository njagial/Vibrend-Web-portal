import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

const CarLeasing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle'); // idle, processing, success

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Database error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  const handleLease = async (car: any) => {
    const phone = prompt("Enter M-Pesa number (07... or 254...)");
    if (!phone) return;

    setStatus('processing');
    try {
      await axios.post("http://localhost:3000/api/payments/stk-push", {
        phone,
        amount: car.pricePerDay,
        carModel: car.model
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000); // Reset after 5 seconds
    } catch (err) {
      alert("Payment initiation failed. Check backend logs.");
      setStatus('idle');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your fleet...</div>;
  return (
    <div className="car-leasing-section">
  <header className="leasing-header">
    <div>
      <h2 className="leasing-title">Vibrend Premium Fleet</h2>
      <p className="leasing-subtitle">Rent locally, pay securely via M-Pesa</p>
    </div>
    {status === 'success' && (
      <div className="payment-success-msg">
        <CheckCircle size={20} style={{marginRight: '8px'}} /> STK Push Sent
      </div>
    )}
  </header>

  <div className="car-grid">
    {cars.map((car: any) => (
      <div key={car._id} className="car-card">
        <div className="car-image-box"><Car size={48} /></div>
        <h3>{car.model}</h3>
        <div className="car-meta">
          <ShieldCheck size={16} style={{marginRight: '6px', color: '#3b82f6'}} />
          {car.provider} • {car.city}
        </div>
        <div className="car-card-footer">
          <div className="price-tag">
            <span className="amount">Ksh {car.pricePerDay.toLocaleString()}</span>
            <span className="currency">per day</span>
          </div>
          <button 
            className="lease-btn"
            onClick={() => handleLease(car)}
            disabled={status === 'processing'}
          >
            <Smartphone size={18} style={{marginRight: '8px'}} />
            {status === 'processing' ? 'Processing...' : 'Rent Now'}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default CarLeasing;