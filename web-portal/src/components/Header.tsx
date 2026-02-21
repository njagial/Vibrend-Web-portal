import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

export default function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo">VibrendTours</div>
        </div>

        <nav className="nav">
          <a href="/Home">Home</a>
          <a href="/destinations">Destinations</a>
          <a href="/packages">Packages</a>
          <a href="/about">About</a>
        </nav>

        {currentUser ? (
          <div className="profile-section">
            <div className="profile-avatar">
              {currentUser.email?.[0].toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {userProfile?.companyName || currentUser.email?.split('@')[0]}
              </div>
              <div className="profile-role">
                {userProfile?.role === 'admin' ? 'Tour Company' : 'Traveler'}
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={() => navigate('/login')} className="login-btn">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="signup-btn">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}