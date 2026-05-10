import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertTriangle, Map, List, Rocket, Shield, LogOut, User } from 'lucide-react';

export default function Navbar({ onAuthClick }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const nav = [
    { path: '/', label: 'STARMAP', icon: Map },
    { path: '/reports', label: 'INTEL FEED', icon: List },
    { path: '/ships', label: 'SHIPS', icon: Rocket },
  ];

  return (
    <nav style={{
      background: 'rgba(6,15,26,0.95)',
      borderBottom: '1px solid #0d2535',
      backdropFilter: 'blur(12px)',
      padding: '0 20px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 40,
      boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ color: '#ff2233', display: 'flex' }}>
          <AlertTriangle size={18} />
        </div>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '14px', color: '#00d4ff', letterSpacing: '0.15em' }}>
          NJSOSS
        </div>
        <div style={{ fontSize: '9px', color: '#4a7a8c', letterSpacing: '0.1em', marginTop: '2px' }}>
          PIRATE ACTIVITY NETWORK
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {nav.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px',
              fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '0.1em',
              color: active ? '#00d4ff' : '#4a7a8c',
              borderBottom: active ? '2px solid #00d4ff' : '2px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <Icon size={12} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: user.avatarColor || '#00d4ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700,
                color: '#030912',
              }}>
                {user.avatar}
              </div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#00d4ff' }}>{user.username}</div>
                <div style={{ fontSize: '9px', color: '#4a7a8c' }}>{user.rank}</div>
              </div>
            </div>
            <button onClick={logout} style={{
              background: 'transparent', border: '1px solid #0d2535',
              color: '#4a7a8c', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px',
            }}>
              <LogOut size={12} />
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} style={{
            background: 'transparent', border: '1px solid #00d4ff',
            color: '#00d4ff', cursor: 'pointer', padding: '6px 14px', borderRadius: '2px',
            fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}>
            <User size={12} />
            SIGN IN
          </button>
        )}
      </div>
    </nav>
  );
}
