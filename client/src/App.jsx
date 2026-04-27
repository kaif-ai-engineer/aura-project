import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskModal from './components/TaskModal';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aura_token'));
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, ongoing: 0, pending: 0, efficiency: '0%' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
        // Refresh stats
        const statsRes = await fetch('/api/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSaveTask = async (formData) => {
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
         const savedTask = await res.json();
         if (editingTask) {
           setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
         } else {
           setTasks([savedTask, ...tasks]);
         }
         setIsModalOpen(false);
         // Refresh stats
         const statsRes = await fetch('/api/stats', { headers: { 'Authorization': `Bearer ${token}` } });
         const statsData = await statsRes.json();
         setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

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
          <button onClick={handleAddTask}>+ New Project</button>
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
                <div className="task-actions">
                  <button className="action-btn" onClick={() => handleEditTask(task)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteTask(task.id)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
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

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}

export default App;
