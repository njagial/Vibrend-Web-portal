import { useState,type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import '../css/SignUp.css';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
      navigate ('/Login')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
  }

 return (
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join the Vibrendportal community today.</p>
      </div>

      {error && <div className="error-toast">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label><Mail size={16} /> Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label><Lock size={16} /> Create Password</label>
          <input
            type="password"
            placeholder="Choose a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label><Lock size={16} /> Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
        >
          {loading ? <div className="spinner-small" /> : <><UserPlus size={18} /> Get Started</>}
        </button>
      </form>

      <div className="auth-footer">
        <button className="btn-secondary-link" onClick={handleLogin}>
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </div>
  </div>
);
}