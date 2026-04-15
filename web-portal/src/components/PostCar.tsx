import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const API_BASE = import.meta.env.VITE_Backend_url;

const PostCar = () => {
  const [formData, setFormData] = useState({
    model: '',
    provider: '',
    city: '',
    pricePerDay: '',
    imageUrl: '', // Match your backend key
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/cars`, formData);
      alert("Car added to fleet successfully!");
      setFormData({ model: '', provider: '', city: '', pricePerDay: '', imageUrl: '' });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error adding car.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="input-group">
        <label>Car Model</label>
        <input 
          value={formData.model} 
          onChange={(e) => setFormData({...formData, model: e.target.value})} 
          placeholder="e.g. Mercedes Benz C200" 
          required 
        />
      </div>
      
      <div className="grid-inputs">
        <div className="input-group">
          <label>Provider</label>
          <input 
            value={formData.provider} 
            onChange={(e) => setFormData({...formData, provider: e.target.value})} 
            placeholder="e.g. Executive Chauffeurs" 
          />
        </div>
        <div className="input-group">
          <label>City</label>
          <input 
            value={formData.city} 
            onChange={(e) => setFormData({...formData, city: e.target.value})} 
            placeholder="Nairobi" 
          />
        </div>
      </div>

      <div className="input-group">
        <label>Price Per Day (Ksh)</label>
        <input 
          type="number"
          value={formData.pricePerDay} 
          onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} 
          placeholder="15000" 
        />
      </div>

      <div className="input-group">
        <label>Car Image</label>
        {formData.imageUrl ? (
          <div className="image-preview-container">
            <img src={formData.imageUrl} alt="Preview" className="admin-img-preview" />
            <button onClick={() => setFormData({...formData, imageUrl: ''})}>Remove</button>
          </div>
        ) : (
          <ImageUpload onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})} />
        )}
      </div>

      <button type="submit" className="submit-btn">Publish to Fleet</button>
    </form>
  );
};

export default PostCar;