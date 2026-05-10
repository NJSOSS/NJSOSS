import { useState } from 'react';
import StarMap3D from '../../components/StarMap/StarMap3D';
import ReportForm from '../../components/Reports/ReportForm';
import ReportCard from '../../components/Reports/ReportCard';
import { useReportStore } from '../../store/reportStore';
import { getDangerColor } from '../../data/starSystems';
import { Thermometer, Plus, ChevronUp, ChevronDown, X, AlertTriangle } from 'lucide-react';

const DRAWER_HEIGHT = '58vh';

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function MobileMapPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState('feed'); // 'feed' | 'system'
  const { reports } = useReportStore();

  const systemReports = selectedSystem
    ? reports.filter(r => r.system === selectedSystem.id)
    : [];

  const handleSystemSelect = (sys) => {
    setSelectedSystem(sys);
    setDrawerView('system');
    setDrawerOpen(true);
  };

  const handleBack = () => {
    setSelectedSystem(null);
    setDrawerView('feed');
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      {/* 3D Map — fills space between nav bars */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <StarMap3D
          showHeatmap={showHeatmap}
          selectedSystem={selectedSystem}
          onSystemSelect={handleSystemSelect}
        />
      </div>

      {/* Top controls overlay */}
      <div style={{
        position: 'absolute', top: '8px', left: '8px', right: '8px',
        display: 'flex', gap: '8px', justifyContent: 'flex-end', zIndex: 20,
        pointerEvents: 'none',
      }}>
        <button onClick={() => setShowHeatmap(h => !h)} style={{
          pointerEvents: 'auto',
          background: showHeatmap ? 'rgba(255,119,0,0.25)' : 'rgba(6,15,26,0.85)',
          border: `1px solid ${showHeatmap ? '#ff7700' : '#0d2535'}`,
          color: showHeatmap ? '#ff7700' : '#4a7a8c',
          padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.08em',
          backdropFilter: 'blur(8px)',
        }}>
          <Thermometer size={13} /> {showHeatmap ? 'HEAT ON' : 'HEATMAP'}
        </button>
      </div>

      {/* Active threat alert */}
      {reports.some(r => r.threatLevel === 5) && !drawerOpen && (
        <div style={{
          position: 'absolute', bottom: drawerOpen ? DRAWER_HEIGHT : '8px',
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,34,51,0.12)', border: '1px solid rgba(255,34,51,0.4)',
          padding: '6px 14px', borderRadius: '4px', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: '6px',
          animation: 'pulse-danger 2s infinite',
          zIndex: 20, whiteSpace: 'nowrap',
        }}>
          <AlertTriangle size={11} color="#ff2233" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#ff2233' }}>
            {reports.filter(r => r.threatLevel === 5).length} CRITICAL THREATS
          </span>
        </div>
      )}

      {/* FAB — report button */}
      <button onClick={() => setShowReport(true)} style={{
        position: 'absolute', right: '14px',
        bottom: drawerOpen ? `calc(${DRAWER_HEIGHT} + 14px)` : '14px',
        width: '50px', height: '50px', borderRadius: '50%',
        background: 'rgba(255,34,51,0.15)', border: '2px solid #ff2233',
        color: '#ff2233', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 20px rgba(255,34,51,0.4)',
        zIndex: 25, transition: 'bottom 0.3s',
      }}>
        <Plus size={22} />
      </button>

      {/* Drawer toggle pill */}
      <button onClick={() => setDrawerOpen(d => !d)} style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        bottom: drawerOpen ? `calc(${DRAWER_HEIGHT} - 2px)` : '8px',
        padding: '7px 18px', background: 'rgba(6,15,26,0.92)',
        border: '1px solid #0d2535', color: '#4a7a8c',
        cursor: 'pointer', borderRadius: '20px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.08em',
        backdropFilter: 'blur(8px)', zIndex: 22,
        transition: 'bottom 0.3s',
      }}>
        {drawerOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        {drawerOpen ? 'CLOSE' : 'INTEL FEED'}
      </button>

      {/* Bottom Drawer */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        height: DRAWER_HEIGHT,
        bottom: drawerOpen ? 0 : `-${DRAWER_HEIGHT}`,
        background: 'rgba(6,15,26,0.97)',
        borderTop: '1px solid #0d2535',
        backdropFilter: 'blur(16px)',
        zIndex: 21,
        transition: 'bottom 0.35s cubic-bezier(0.32, 0, 0.28, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
          <div style={{ width: '36px', height: '3px', background: '#0d2535', borderRadius: '2px' }} />
        </div>

        {/* Drawer tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #0d2535', flexShrink: 0 }}>
          {selectedSystem && (
            <button onClick={() => setDrawerView('system')} style={{
              flex: 1, padding: '10px', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: drawerView === 'system' ? '2px solid #00d4ff' : '2px solid transparent',
              color: drawerView === 'system' ? '#00d4ff' : '#4a7a8c',
              fontFamily: 'Orbitron, sans-serif', fontSize: '9px',
            }}>
              {selectedSystem.name.toUpperCase()}
            </button>
          )}
          <button onClick={() => setDrawerView('feed')} style={{
            flex: 1, padding: '10px', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: drawerView === 'feed' ? '2px solid #00d4ff' : '2px solid transparent',
            color: drawerView === 'feed' ? '#00d4ff' : '#4a7a8c',
            fontFamily: 'Orbitron, sans-serif', fontSize: '9px',
          }}>
            INTEL FEED
          </button>
        </div>

        {/* System info view */}
        {drawerView === 'system' && selectedSystem && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: selectedSystem.starColor, boxShadow: `0 0 8px ${selectedSystem.starColor}` }} />
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#00d4ff' }}>
                  {selectedSystem.name}
                </span>
              </div>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#4a7a8c', cursor: 'pointer', fontSize: '10px', fontFamily: 'Orbitron, sans-serif' }}>
                ← GALAXY
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', color: '#4a7a8c' }}>{selectedSystem.type}</span>
              <span style={{ fontSize: '10px', color: '#4a7a8c' }}>·</span>
              <span style={{ fontSize: '10px', color: '#4a7a8c' }}>{selectedSystem.status}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: getDangerColor(selectedSystem.dangerLevel) }}>
                DANGER {selectedSystem.dangerLevel}/5
              </span>
            </div>

            <p style={{ fontSize: '11px', color: '#8fb8cc', lineHeight: '1.6', marginBottom: '12px' }}>
              {selectedSystem.description}
            </p>

            {/* Planets */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#4a7a8c', marginBottom: '6px' }}>PLANETS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(selectedSystem.planets || []).map(p => (
                  <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#8fb8cc', background: '#0d2535', padding: '4px 8px', borderRadius: '2px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* System reports */}
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#ff2233', marginBottom: '8px' }}>
              {systemReports.length} ACTIVE REPORTS
            </div>
            {systemReports.slice(0, 3).map(r => <ReportCard key={r.id} report={r} compact />)}
            {systemReports.length === 0 && (
              <div style={{ fontSize: '11px', color: '#4a7a8c', textAlign: 'center', padding: '16px' }}>
                No pirate reports for this system
              </div>
            )}
          </div>
        )}

        {/* Intel feed view */}
        {drawerView === 'feed' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            {[...reports].sort((a, b) => b.timestamp - a.timestamp).map(r => (
              <ReportCard key={r.id} report={r} compact />
            ))}
          </div>
        )}
      </div>

      {showReport && (
        <ReportForm onClose={() => setShowReport(false)} preselectedSystem={selectedSystem?.id} />
      )}
    </div>
  );
}
