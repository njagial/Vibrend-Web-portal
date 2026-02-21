import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert('Failed to log out');
    }
  }

  return (
    <div className='dashboard'>
      <h2>Dashboard</h2>
      <p>Welcome, {currentUser?.email}!</p>
      <button className='logout' type='submit' onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert('Failed to log out');
    }
  }

  return (
    <div className='logout'>
      <button className='logout' type='submit' onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}