import { useState } from 'react';
import StarMap3D from '../components/StarMap/StarMap3D';
import ReportForm from '../components/Reports/ReportForm';
import ReportFeed from '../components/Reports/ReportFeed';
import StatsPanel from '../components/Dashboard/StatsPanel';
import { useReportStore } from '../store/reportStore';
import { STAR_SYSTEMS, getDangerColor } from '../data/starSystems';
import { AlertTriangle, Thermometer, ChevronLeft, Map, BarChart2, Plus, Info, X } from 'lucide-react';

export default function MapPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [rightPanel, setRightPanel] = useState('feed'); // 'feed' | 'stats'
  const { reports } = useReportStore();

  const systemReports = selectedSystem
    ? reports.filter(r => r.system === selectedSystem.id)
    : [];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Left panel - system info */}
      <div style={{
        width: '240px', flexShrink: 0, background: 'rgba(6,15,26,0.95)',
        borderRight: '1px solid #0d2535', display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)', zIndex: 10,
      }}>
        {/* Controls */}
        <div style={{ padding: '12px', borderBottom: '1px solid #0d2535' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#4a7a8c', letterSpacing: '0.1em', marginBottom: '10px' }}>
            MAP CONTROLS
          </div>
          <button onClick={() => setShowHeatmap(h => !h)} style={{
            width: '100%', padding: '8px 12px', marginBottom: '6px',
            background: showHeatmap ? 'rgba(255,119,0,0.15)' : 'transparent',
            border: `1px solid ${showHeatmap ? '#ff7700' : '#0d2535'}`,
            color: showHeatmap ? '#ff7700' : '#4a7a8c',
            cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
          }}>
            <Thermometer size={12} /> {showHeatmap ? 'HIDE HEATMAP' : 'SHOW HEATMAP'}
          </button>
          <button onClick={() => setShowReport(true)} style={{
            width: '100%', padding: '8px 12px',
            background: 'rgba(255,34,51,0.1)', border: '1px solid #ff2233',
            color: '#ff2233', cursor: 'pointer',
            fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Plus size={12} /> REPORT PIRATES
          </button>
        </div>

        {/* Selected system info */}
        {selectedSystem ? (
          <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
            <button onClick={() => setSelectedSystem(null)} style={{
              background: 'transparent', border: 'none', color: '#4a7a8c',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '10px', marginBottom: '12px', padding: 0,
            }}>
              <ChevronLeft size={12} /> BACK TO GALAXY
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: selectedSystem.starColor, boxShadow: `0 0 8px ${selectedSystem.starColor}` }} />
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: '#00d4ff' }}>
                {selectedSystem.name.toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#4a7a8c', marginBottom: '6px' }}>{selectedSystem.type}</div>
            <div style={{
              display: 'inline-flex', padding: '3px 8px', marginBottom: '10px',
              border: `1px solid ${getDangerColor(selectedSystem.dangerLevel)}`,
              color: getDangerColor(selectedSystem.dangerLevel),
              fontFamily: 'Orbitron, sans-serif', fontSize: '9px', borderRadius: '2px',
            }}>
              {'●'.repeat(selectedSystem.dangerLevel)} DANGER {selectedSystem.dangerLevel}/5
            </div>

            <p style={{ fontSize: '11px', color: '#8fb8cc', lineHeight: '1.6', marginBottom: '12px' }}>
              {selectedSystem.description}
            </p>

            <div style={{ borderTop: '1px solid #0d2535', paddingTop: '10px', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#4a7a8c', marginBottom: '6px' }}>PLANETS</div>
              {(selectedSystem.planets || []).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '10px', color: '#8fb8cc' }}>{p.name}</span>
                  {p.stations?.length > 0 && <span style={{ fontSize: '9px', color: '#4a7a8c' }}>({p.stations.length} stations)</span>}
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #0d2535', paddingTop: '10px' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#ff2233', marginBottom: '6px' }}>
                PIRATE REPORTS: {systemReports.length}
              </div>
              {systemReports.slice(0, 3).map(r => (
                <div key={r.id} style={{
                  padding: '6px 8px', background: 'rgba(255,34,51,0.05)',
                  border: '1px solid rgba(255,34,51,0.15)', borderRadius: '2px', marginBottom: '4px',
                }}>
                  <div style={{ fontSize: '9px', color: '#ff7700', marginBottom: '2px' }}>{r.location}</div>
                  <div style={{ fontSize: '9px', color: '#4a7a8c' }}>{r.pirateCount} pirates spotted</div>
                </div>
              ))}
              {systemReports.length > 3 && (
                <div style={{ fontSize: '9px', color: '#4a7a8c', textAlign: 'center', marginTop: '4px' }}>
                  +{systemReports.length - 3} more reports
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#4a7a8c', letterSpacing: '0.1em', marginBottom: '10px' }}>
              SYSTEM THREAT STATUS
            </div>
            {STAR_SYSTEMS.map(sys => {
              const count = reports.filter(r => r.system === sys.id).length;
              return (
                <button key={sys.id} onClick={() => setSelectedSystem(sys)} style={{
                  width: '100%', padding: '8px 10px', marginBottom: '4px',
                  background: 'transparent', border: '1px solid #0d2535',
                  borderLeft: `2px solid ${getDangerColor(sys.dangerLevel)}`,
                  cursor: 'pointer', textAlign: 'left', borderRadius: '2px',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#8fb8cc' }}>{sys.name}</span>
                    {count > 0 && (
                      <span style={{ fontSize: '9px', color: '#ff2233', fontFamily: 'Orbitron, sans-serif' }}>
                        {count} ●
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '9px', color: '#4a7a8c', marginTop: '2px' }}>{sys.status}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Map - center */}
      <div style={{ flex: 1, position: 'relative' }}>
        <StarMap3D
          showHeatmap={showHeatmap}
          selectedSystem={selectedSystem}
          onSystemSelect={(sys) => setSelectedSystem(sys)}
        />

        {/* Map overlay info */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(6,15,26,0.85)', border: '1px solid #0d2535',
          padding: '8px 20px', backdropFilter: 'blur(8px)',
          fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#4a7a8c',
          letterSpacing: '0.08em', pointerEvents: 'none',
          display: 'flex', gap: '20px',
        }}>
          <span>SCROLL: ZOOM</span>
          <span>DRAG: ROTATE</span>
          <span>CLICK SYSTEM: SELECT</span>
          {showHeatmap && <span style={{ color: '#ff7700' }}>⬤ HEATMAP ACTIVE</span>}
        </div>

        {/* Alert banner for extreme threats */}
        {reports.some(r => r.threatLevel === 5) && (
          <div style={{
            position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,34,51,0.1)', border: '1px solid rgba(255,34,51,0.4)',
            padding: '6px 16px', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'pulse-danger 2s infinite',
          }}>
            <AlertTriangle size={12} color="#ff2233" />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#ff2233', letterSpacing: '0.1em' }}>
              EXTREME THREAT ACTIVE — {reports.filter(r => r.threatLevel === 5).length} CRITICAL REPORTS
            </span>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div style={{
        width: '300px', flexShrink: 0, background: 'rgba(6,15,26,0.95)',
        borderLeft: '1px solid #0d2535', display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)', zIndex: 10,
      }}>
        {/* Panel tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #0d2535', flexShrink: 0 }}>
          {[
            { id: 'feed', label: 'INTEL FEED', icon: AlertTriangle },
            { id: 'stats', label: 'STATISTICS', icon: BarChart2 },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setRightPanel(id)} style={{
              flex: 1, padding: '10px',
              background: rightPanel === id ? 'rgba(0,212,255,0.05)' : 'transparent',
              border: 'none', borderBottom: rightPanel === id ? '2px solid #00d4ff' : '2px solid transparent',
              color: rightPanel === id ? '#00d4ff' : '#4a7a8c',
              cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.08em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}>
              <Icon size={11} /> {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {rightPanel === 'feed' ? <ReportFeed compact /> : <StatsPanel />}
        </div>
      </div>

      {/* Report form modal */}
      {showReport && (
        <ReportForm
          onClose={() => setShowReport(false)}
          preselectedSystem={selectedSystem?.id}
        />
      )}
    </div>
  );
}
