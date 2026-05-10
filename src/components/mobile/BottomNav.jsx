import { Link, useLocation } from 'react-router-dom';
import { Map, List, Rocket, AlertTriangle } from 'lucide-react';

const tabs = [
  { path: '/', icon: Map, label: 'STARMAP' },
  { path: '/reports', icon: List, label: 'INTEL' },
  { path: '/ships', icon: Rocket, label: 'SHIPS' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '58px',
      background: 'rgba(6,15,26,0.98)', borderTop: '1px solid #0d2535',
      display: 'flex', zIndex: 50, backdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
    }}>
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px',
            textDecoration: 'none',
            color: active ? '#00d4ff' : '#4a7a8c',
            borderTop: active ? '2px solid #00d4ff' : '2px solid transparent',
            transition: 'all 0.2s',
          }}>
            <Icon size={20} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', letterSpacing: '0.08em' }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
