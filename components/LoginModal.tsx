// Login modal component
import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 215, 0, 0.05)',
        backdropFilter: 'blur(30px)',
        padding: '3rem',
        borderRadius: '25px',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 900,
            background: 'linear-gradient(45deg, #ffd700, #ffb347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Admin Login
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffd700',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ffd700',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
              placeholder="admin@scribbledcanvas.com"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ffd700',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div style={{
              color: '#ffb347',
              marginBottom: '1rem',
              padding: '0.5rem',
              background: 'rgba(255, 179, 71, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(45deg, #ffd700, #ffb347)',
              color: '#000000',
              border: 'none',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '12px',
          fontSize: '0.85rem',
          color: 'rgba(255, 215, 0, 0.7)'
        }}>
          <strong>Demo Credentials:</strong><br />
          Admin: admin@scribbledcanvas.com / admin123<br />
          Editor: editor@scribbledcanvas.com / editor123
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
