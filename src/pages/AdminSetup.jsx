import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            full_name: fullName,
          },
        },
      });
      if (signUpError) throw signUpError;

      const userId = data?.user?.id;
      if (userId) {
        // Ensure profile has basic details. Role defaults to admin in schema.
        await supabase
          .from('profiles')
          .upsert({ id: userId, email, full_name: fullName }, { onConflict: 'id' });
      }

      setMessage('Account created. Next, promote this email to admin in Supabase SQL, then sign in.');
      navigate('/admin/login');
    } catch (err) {
      setError(err.message || 'Unable to create admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <h1>Create Admin Account</h1>
        <p>Create your account, then promote it to admin in Supabase SQL (one-time setup).</p>

        <form onSubmit={handleCreateAdmin} className="login-form">
          <label htmlFor="setup-full-name">Full Name</label>
          <input
            id="setup-full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            required
          />

          <label htmlFor="setup-email">Email</label>
          <input
            id="setup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="setup-password">Password</label>
          <input
            id="setup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <label htmlFor="setup-confirm-password">Confirm Password</label>
          <input
            id="setup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
        {error && <p className="login-error">{error}</p>}

        <p className="login-back-link">
          <Link to="/admin/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
