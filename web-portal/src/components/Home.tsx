import Header from './Header';
import HeroSection from './HeroSection';
import '../css/Home.css';
import { useState } from 'react';

const sampleDestinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    price: '$899',
    duration: '7 Days',
    rating: 4.8,
    description: 'Tropical paradise with stunning beaches'
  },
  {
    id: 2,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    price: '$1,299',
    duration: '5 Days',
    rating: 4.9,
    description: 'The city of lights and romance'
  },
  {
    id: 3,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: '$1,499',
    duration: '6 Days',
    rating: 4.7,
    description: 'Modern metropolis meets ancient tradition'
  },
  {
    id: 4,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    price: '$1,099',
    duration: '5 Days',
    rating: 4.9,
    description: 'White-washed buildings and blue domes'
  },
  {
    id: 5,
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: '$2,199',
    duration: '8 Days',
    rating: 5.0,
    description: 'Luxury overwater bungalows'
  },
  {
    id: 6,
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    price: '$1,799',
    duration: '6 Days',
    rating: 4.6,
    description: 'Futuristic city in the desert'
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Beach', 'City', 'Adventure', 'Cultural', 'Luxury'];

  return (
    <div className="home-page">
      <Header />
      <HeroSection />

      <div className="home-content">
        <div className="category-section">
          <h2 className="section-title">Popular Destinations</h2>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="destinations-grid">
          {sampleDestinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <div 
                className="destination-image"
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className="destination-price">{destination.price}</div>
              </div>

              <div className="destination-content">
                <div className="destination-header">
                  <h3 className="destination-name">{destination.name}</h3>
                  <div className="destination-rating">
                    ⭐ {destination.rating}
                  </div>
                </div>

                <p className="destination-description">
                  {destination.description}
                </p>

                <div className="destination-footer">
                  <span className="destination-duration">📅 {destination.duration}</span>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}