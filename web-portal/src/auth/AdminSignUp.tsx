import React, { useState } from 'react';
import { auth, db } from '../configs/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'admin',
        uid: user.uid,
        createdAt: new Date()
      });

      navigate('/adminDashboard'); // Redirect to admin dashboard after signup
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Admin</h2>
      <form onSubmit={handleSignup} className="admin-form">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="submit-btn">Register Admin</button>
      </form>
    </div>
  );
};

export default AdminSignup;