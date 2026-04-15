import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload'; // Reusing the component we just built

const API_BASE = import.meta.env.VITE_Backend_url;

const PostDestination = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: Ensure your backend is expecting /api/destinations or /api/places
      await axios.post(`${API_BASE}/destinations`, formData);
      alert("New adventure published!");
      setFormData({ title: '', location: '', price: '', description: '', imageUrl: '' });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to post destination.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="input-group">
        <label>Destination Title</label>
        <input 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
          placeholder="e.g. Diani Beach" 
          required 
        />
      </div>

      <div className="input-group">
        <label>Location</label>
        <input 
          value={formData.location} 
          onChange={(e) => setFormData({...formData, location: e.target.value})} 
          placeholder="e.g. Kwale County" 
        />
      </div>

      <div className="input-group">
        <label>Display Price (include 'Ksh')</label>
        <input 
          value={formData.price} 
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          placeholder="Ksh 12,500" 
        />
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea 
          rows={4}
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          placeholder="What makes this place special?" 
        />
      </div>

      <div className="input-group">
        <label>Cover Photo</label>
        {formData.imageUrl ? (
          <div className="image-preview-container">
            <img src={formData.imageUrl} alt="Preview" className="admin-img-preview" />
            <button className="remove-img-btn" onClick={() => setFormData({...formData, imageUrl: ''})}>
              Replace Image
            </button>
          </div>
        ) : (
          <ImageUpload onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})} />
        )}
      </div>

      <button type="submit" className="submit-btn">Publish Destination</button>
    </form>
  );
};

export default PostDestination;