import { useState,type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <div className='login-form'>
      <h2>Log In</h2>
      {error && <div className='login-error'>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className='login-submit'>
          <label>Email</label>
          <input
            className='login-email'
            type="email"
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className='login-pin'>
          <label>Password</label>
          <input
            type="password"
            className='login-password'
            placeholder='Enter your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          disabled={loading} 
          className='login-enter'
          type="submit"
        >
          Log In
        </button>
      </form>

      <button 
        onClick={handleGoogleSignIn}
        className='login-google'
        disabled={loading}
      >
        Sign In with Google
      </button>
      <button
        onClick={handleSignUp}
        >
        signup
      </button>
    </div>
  );
}

