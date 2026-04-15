import React, { useState } from 'react';
import PostDestination from './PostDestination';
import PostCar from './PostCar';
import { MapPin, Car, LayoutDashboard, PlusCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../configs/firebase';

const checkAdminPrivileges = async (user: any) => {
  if (!user) return false;
  
  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().role === 'admin') {
      return true; // They are an admin!
    }
    return false; // Not an admin
  } catch (error) {
    console.error("Auth check failed", error);
    return false;
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'destinations' | 'cars'>('destinations');

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">Vibrend Admin</div>
        <nav>
          <button 
            className={activeTab === 'destinations' ? 'active' : ''} 
            onClick={() => setActiveTab('destinations')}
          >
            <MapPin size={20} /> Destinations
          </button>
          <button 
            className={activeTab === 'cars' ? 'active' : ''} 
            onClick={() => setActiveTab('cars')}
          >
            <Car size={20} /> Car Fleet
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>{activeTab === 'destinations' ? 'Add New Destination' : 'Add New Car'}</h1>
        </header>
        
        <div className="form-card">
          {activeTab === 'destinations' ? <PostDestination /> : <PostCar />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;