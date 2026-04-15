import { useState,type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome, } from 'lucide-react';
import '../css/Login.css';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSignUp() {
    navigate('/SignUp');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/Dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in with Google: ' + err.message);
    }
    setLoading(false);
  }

  return (
  <div className="auth-container">
    <div className="login-card">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Your next journey starts here.</p>
      </div>

      {error && <div className="error-toast">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-field">
          <label><Mail size={16} /> Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <label><Lock size={16} /> Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
        >
          {loading ? <div className="spinner-small" /> : <><LogIn size={18} /> Log In</>}
        </button>
      </form>

      <div className="divider"><span>or</span></div>

      <button 
        onClick={handleGoogleSignIn} 
        className="btn-google" 
        disabled={loading}
      >
        <Chrome size={18} /> Sign In with Google
      </button>

      <p className="auth-footer">
        New here? <span onClick={handleSignUp} className="auth-link">Create an account</span>
      </p>
    </div>
    <div className="admin-access-link">
    <Link to="/admin">
      <Shield size={14} /> Admin Portal Access
    </Link>
  </div>
  </div>
);
}

