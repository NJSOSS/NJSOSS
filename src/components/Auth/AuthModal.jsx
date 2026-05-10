import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X, Shield, User, Mail, Lock, AlertCircle } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '10px 12px',
  background: 'rgba(3,9,18,0.9)', border: '1px solid #0d2535',
  color: '#8fb8cc', fontFamily: 'inherit', fontSize: '12px',
  borderRadius: '2px', outline: 'none',
};

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login, register, error, clearError } = useAuthStore();

  const set = (k) => (e) => {
    clearError();
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (tab === 'login') {
      if (login(form.email, form.password)) onClose();
    } else {
      if (!form.username || !form.email || !form.password) return;
      if (register(form.username, form.email, form.password)) onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#060f1a', border: '1px solid #0d2535',
        borderRadius: '4px', width: '380px', padding: '28px',
        boxShadow: '0 0 40px rgba(0,212,255,0.1)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="#00d4ff" />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#00d4ff', letterSpacing: '0.1em' }}>
              {tab === 'login' ? 'PILOT AUTHENTICATION' : 'REGISTER PILOT'}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a7a8c', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #0d2535', marginBottom: '20px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); clearError(); }} style={{
              flex: 1, padding: '8px', background: 'none', border: 'none',
              fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '0.1em',
              color: tab === t ? '#00d4ff' : '#4a7a8c',
              borderBottom: tab === t ? '2px solid #00d4ff' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t === 'login' ? 'SIGN IN' : 'REGISTER'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'register' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#4a7a8c', marginBottom: '6px' }}>
                <User size={11} /> PILOT HANDLE
              </label>
              <input style={inputStyle} placeholder="YourCallsign" value={form.username} onChange={set('username')} />
            </div>
          )}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#4a7a8c', marginBottom: '6px' }}>
              <Mail size={11} /> EMAIL
            </label>
            <input type="email" style={inputStyle} placeholder="pilot@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#4a7a8c', marginBottom: '6px' }}>
              <Lock size={11} /> PASSWORD
            </label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={form.password} onChange={set('password')} />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(255,34,51,0.1)', border: '1px solid rgba(255,34,51,0.3)', borderRadius: '2px', color: '#ff2233', fontSize: '11px' }}>
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <button type="submit" style={{
            marginTop: '4px', padding: '12px',
            background: 'transparent', border: '1px solid #00d4ff',
            color: '#00d4ff', cursor: 'pointer',
            fontFamily: 'Orbitron, sans-serif', fontSize: '11px', letterSpacing: '0.15em',
            transition: 'all 0.2s',
          }}>
            {tab === 'login' ? 'AUTHENTICATE' : 'ENLIST'}
          </button>
        </form>
      </div>
    </div>
  );
}
