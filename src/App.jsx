import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import MobileNavbar from './components/mobile/MobileNavbar';
import BottomNav from './components/mobile/BottomNav';
import MapPage from './pages/MapPage';
import ReportsPage from './pages/ReportsPage';
import ShipsPage from './pages/ShipsPage';
import MobileMapPage from './pages/mobile/MobileMapPage';
import MobileReportsPage from './pages/mobile/MobileReportsPage';
import AuthModal from './components/Auth/AuthModal';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#030912', overflow: 'hidden' }}>
        <MobileNavbar onAuthClick={() => setAuthOpen(true)} />
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
        {/* content area: between top nav (48px) and bottom nav (58px) */}
        <div style={{ flex: 1, marginTop: '48px', marginBottom: '58px', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<MobileMapPage />} />
            <Route path="/reports" element={<MobileReportsPage />} />
            <Route path="/ships" element={<ShipsPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    );
  }

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
