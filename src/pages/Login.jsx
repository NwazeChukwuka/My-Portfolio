import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Debug email changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    console.log('Email input changed:', value);
    setEmail(value);
  };

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;

    const boot = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        navigate('/admin');
      }
    };
    boot();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/admin');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      setMessage('Login successful.');
      navigate('https://mazichukwuka.vercel.app/admin');
    } catch (err) {
      setError(err.message || 'Unable to log in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    console.log('Magic link button clicked, email:', email);
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://mazichukwuka.vercel.app/admin',
        },
      });
      if (otpError) throw otpError;
      setMessage('Magic link sent. Open it from your email to sign in without a password.');
    } catch (err) {
      setError(err.message || 'Unable to send magic link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async () => {
    console.log('Reset password button clicked, email:', email);
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://mazichukwuka.vercel.app/admin/reset-password',
      });
      if (resetError) throw resetError;
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Unable to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <h1>Welcome Master</h1>
        <p>You found our secret portal. Enter the magic word to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="myprofile@chukwuka.com"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the magic word"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          className="magic-link-btn"
          onClick={handleMagicLink}
          disabled={loading || !email}
        >
          Send Magic Link
        </button>
        <button
          type="button"
          className="magic-link-btn"
          onClick={handleSendReset}
          disabled={loading || !email}
        >
          Forgot Password / Reset Password
        </button>

        {message && <p className="login-message">{message}</p>}
        {error && <p className="login-error">{error}</p>}

        <p className="login-back-link">
          <Link to="/">Back to site</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
