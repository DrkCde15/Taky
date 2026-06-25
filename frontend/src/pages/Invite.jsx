import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import './Auth.css';

export default function Invite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Nenhum token de convite fornecido');
      setValidating(false);
      return;
    }
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios
      .post(`${baseURL}/auth/invite/validate?token=${token}`)
      .then(() => {
        setValid(true);
        setValidating(false);
      })
      .catch(() => {
        setError('Token de convite inválido ou expirado');
        setValidating(false);
      });
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role: 'member' });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-page animate-fade-in">
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <p>Validando link de convite...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="auth-page animate-fade-in">
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <h2>Convite Inválido</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
            {error || 'Este link de convite é inválido ou expirou.'}
          </p>
          <Link to="/register">Criar uma conta</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page animate-fade-in">
      <form onSubmit={handleRegister} className="auth-card glass" style={{ border: '2px solid var(--accent-primary)' }}>
        <div className="auth-header">
          <div className="invite-icon">
            <ShieldCheck size={40} color="var(--accent-primary)" />
          </div>
          <h1>Convite para Equipe</h1>
          <p>
            Você foi convidado para participar do projeto como <strong>Usuário da Equipe</strong>.
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="João Silva"
            required
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joao@empresa.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Criar Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar na Equipe'} <ArrowRight size={20} />
        </button>

        <p className="auth-footer">
          Ao entrar, você será atribuído como usuário padrão.
        </p>
      </form>
    </div>
  );
}
