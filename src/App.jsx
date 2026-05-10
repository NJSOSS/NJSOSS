import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import MapPage from './pages/MapPage';
import ReportsPage from './pages/ReportsPage';
import ShipsPage from './pages/ShipsPage';
import AuthModal from './components/Auth/AuthModal';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#030912' }}>
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/ships" element={<ShipsPage />} />
        </Routes>
      </div>
    </div>
  );
}
