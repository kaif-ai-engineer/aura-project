import React, { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aura_token'));
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, ongoing: 0, pending: 0, efficiency: '0%' });
  const [loading, setLoading] = useState(true);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('aura_token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aura_token');
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [tasksRes, statsRes, userRes] = await Promise.all([
          fetch('/api/tasks', { headers }),
          fetch('/api/stats', { headers }),
          fetch('/api/auth/me', { headers })
        ]);

        if (tasksRes.status === 401 || statsRes.status === 401) {
            handleLogout();
            return;
        }

        const tasksData = await tasksRes.json();
        const statsData = await statsRes.json();
        const userData = await userRes.json();
        
        setTasks(tasksData);
        setStats(statsData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <h2 className="gradient-text">Initializing Aura...</h2>
      </div>
    );
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="aura-container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Aura</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.email?.split('@')[0] || 'User'}.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }} onClick={handleLogout}>Logout</button>
          <button>+ New Project</button>
          <div className="glass-card" style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontWeight: 'bold' }}>
             {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      <section className="stats-row">
        <div className="glass-card stat-item">
          <span className="stat-label">Efficiency</span>
          <span className="stat-value gradient-text">{stats.efficiency}</span>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.ongoing}</span>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </section>

      <main className="dashboard-grid">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3>Recent Tasks</h3>
          <div className="task-list" style={{ marginTop: '1rem' }}>
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: task.status === 'Completed' ? '#33ffaa' : '#8833ff' 
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500 }}>{task.title}</p>
                  <small style={{ color: 'var(--text-secondary)' }}>{task.category}</small>
                </div>
                <span className={`badge badge-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3>Activity Feed</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent-color)' }}>●</span> Changed "Auth System" to High Priority
            </li>
            <li style={{ fontSize: '0.85rem' }}>
              <span style={{ color: '#ff33aa' }}>●</span> Deployed Aura v1.0.4 to Staging
            </li>
            <li style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>●</span> Added 3 new assets to Design System
            </li>
          </ul>
          <button style={{ marginTop: '2rem', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}>
            View Full Log
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
