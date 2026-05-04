import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (event) => {
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

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setMessage('Password updated successfully. You can now sign in.');
      setTimeout(() => navigate('/admin/login'), 900);
    } catch (err) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <h1>Reset Password</h1>
        <p>Set a new password for your admin account.</p>

        <form onSubmit={handleResetPassword} className="login-form">
          <label htmlFor="reset-password">New Password</label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <label htmlFor="reset-password-confirm">Confirm New Password</label>
          <input
            id="reset-password-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save New Password'}
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

export default ResetPassword;
