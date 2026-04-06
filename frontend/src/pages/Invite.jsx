import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Invite() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Force 'member' role because it's an invitation
      await register({ name, email, password, role: 'member' });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      padding: '1rem',
      background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)'
    }}>
      <form onSubmit={handleRegister} className="glass" style={{
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        border: '2px solid var(--accent-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <ShieldCheck size={40} color="var(--accent-primary)" />
            </div>
          </div>
          <h1>Team Invitation</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            You've been invited to join the project as a <strong>Team User</strong>.
          </p>
        </div>

        {error && <div style={{ color: 'var(--error)', background: 'rgba(248, 81, 73, 0.1)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@work.com"
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label>Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--bg-primary)',
          border: 'none',
          padding: '1rem',
          fontWeight: '700',
          marginTop: '0.5rem'
        }}>
          Join the Team <ArrowRight size={20} />
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          By joining, you'll be assigned as a standard user.
        </p>
      </form>
    </div>
  );
}
