import { useAuthStore } from '../../store/authStore';
import { AlertTriangle, User, LogOut } from 'lucide-react';

export default function MobileNavbar({ onAuthClick }) {
  const { user, logout } = useAuthStore();
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '48px',
      background: 'rgba(6,15,26,0.97)', borderBottom: '1px solid #0d2535',
      display: 'flex', alignItems: 'center', padding: '0 14px',
      justifyContent: 'space-between', zIndex: 40, backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={14} color="#ff2233" />
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#00d4ff', letterSpacing: '0.15em', fontWeight: 700 }}>
          NJSOSS
        </span>
      </div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: user.avatarColor || '#00d4ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#030912',
          }}>{user.avatar}</div>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#4a7a8c', cursor: 'pointer', padding: '4px' }}>
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button onClick={onAuthClick} style={{
          background: 'transparent', border: '1px solid #00d4ff', color: '#00d4ff',
          padding: '5px 12px', borderRadius: '2px', cursor: 'pointer',
          fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <User size={11} /> SIGN IN
        </button>
      )}
    </div>
  );
}
