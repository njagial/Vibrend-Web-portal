import { useState,type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <div className='signUp'>
      <h2>Sign Up</h2>
      {error && <div className='signUp-error'>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className='signUp-form'>
          <label>Email</label>
          <input
            title="email_signup"
            className='signUp-email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className='signUp-password'>
          <label>Password</label>
          <input
            title='password_signup'
            placeholder='Enter your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
        </div>
        
        <div className='signUp-confirm'>
          <label>Confirm Password</label>
          <input
            type="password"
            className='signUp-confirmPin'
            placeholder='Confirm your Password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        
        <button 
          disabled={loading} 
          className='signUp-enter'
          type="submit"
        >
          Sign Up
        </button>
        <button
          onClick={handleLogin}>
            login
        </button>
      </form>
    </div>
  );
}