import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1a1a2e 0%, #050505 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '400px', padding: '3rem' }}
      >
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome to <span className="gradient-text">Aura</span></h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Please enter your credentials to continue.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="admin@aura.sh" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>
          
          {error && <p style={{ color: '#ff3333', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '1rem', height: '3rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
             New here? <span style={{ color: 'var(--accent-color)', cursor: 'pointer' }}>Create an account</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
