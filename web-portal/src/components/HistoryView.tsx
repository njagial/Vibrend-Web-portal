import React, { useState, useEffect } from 'react';
import { Trash2, FileText, Calendar } from 'lucide-react';
import { fetchMyBookings, deleteBooking, type Booking } from '../apis/booking';

const HistoryView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- LOAD HISTORY ---
  const getHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this booking from your history?")) {
      try {
        await deleteBooking(id);
        // Refresh local state without a full reload
        setBookings(prev => prev.filter(b => b.id !== id));
      } catch  {
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="history-view">
        <h2 className="page-title">Loading History...</h2>
        <div className="skeleton-list">
           {[1, 2, 3].map(n => <div key={n} className="skeleton-line shim" style={{ height: '60px', marginBottom: '10px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="history-view">
      <div className="view-header">
        <h2 className="page-title">My Booking History</h2>
        <p className="page-subtitle">Manage your past adventures and receipts.</p>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Guests</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, i) => (
                <tr key={b.id || i} className="history-row">
                  <td className="dest-cell">
                    <span className="dest-title">{b.destinationTitle}</span>
                    <span className="dest-date">
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </td>
                  <td>{b.people} Guests</td>
                  <td>{b.duration} Nights</td>
                  <td className="amount-cell">
                    <span className="currency-label">Ksh</span> {b.amount.toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => b.id && handleDelete(b.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-row-cell">
                  <div className="empty-state">
                    <FileText size={48} color="#d1d5db" />
                    <p>No bookings found. Start exploring!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;