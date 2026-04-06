import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const setUser = useAuthStore((s) => s.setUser);
  const userStore = useAuthStore((s) => s.user);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      // We got the user, now show modal to pick role
      setTempUser(data.user);
      setShowRoleModal(true);
    } catch (err) {
      setError(err);
    }
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    // Persist the choice to the store
    setUser({ ...tempUser, role });
    // In a real app we'd update the DB too, but for now we follow the user choice
    navigate('/');
  };



  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      padding: '1rem'
    }}>
      <form onSubmit={handleLogin} className="glass" style={{
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Tasky</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Manage your team easily.</p>
        </div>

        {error && <div style={{ color: 'var(--error)', background: 'rgba(248, 81, 73, 0.1)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}


        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--bg-primary)',
          border: 'none',
          padding: '1rem',
          fontWeight: '700',
          marginTop: '1rem'
        }}>
          Sign in <ArrowRight size={20} />
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>

      {showRoleModal && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass" style={{
            padding: '3rem',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '450px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Choose Perspective</h2>
            <p style={{ color: 'var(--text-secondary)' }}>How would you like to access the dashboard today?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => handleRoleSelect('admin')}
                style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(56, 189, 248, 0.1)', 
                  border: '1px solid var(--accent-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>Admin/Leader</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Manage teams, analytics and overall project health.</span>
              </button>

              <button 
                onClick={() => handleRoleSelect('member')}
                style={{ 
                  padding: '1.5rem', 
                  background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontWeight: '700' }}>Team User</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Track your tasks, submit for review and log hours.</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

