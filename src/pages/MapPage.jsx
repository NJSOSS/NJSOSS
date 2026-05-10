import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, AlertTriangle, Map, X, Info, ChevronRight, Globe,
  Radio, ZoomIn, Eye, EyeOff
} from 'lucide-react';
import StarMap3D from '../components/StarMap/StarMap3D';
import ReportFeed from '../components/Reports/ReportFeed';
import StatsPanel from '../components/Dashboard/StatsPanel';
import ReportForm from '../components/Reports/ReportForm';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import { STAR_SYSTEMS } from '../data/starSystems';
import { getDangerColor } from '../data/starSystems';

const DANGER_COLORS = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };

export default function MapPage({ onAuthRequired }) {
  const selectedSystem = useReportStore((s) => s.selectedSystem);
  const setSelectedSystem = useReportStore((s) => s.setSelectedSystem);
  const showHeatmap = useReportStore((s) => s.showHeatmap);
  const setShowHeatmap = useReportStore((s) => s.setShowHeatmap);
  const getReportsBySystem = useReportStore((s) => s.getReportsBySystem);
  const user = useAuthStore((s) => s.user);

  const [showReportForm, setShowReportForm] = useState(false);
  const [leftPanel, setLeftPanel] = useState('info'); // 'info' | 'stats'
  const [showRightPanel, setShowRightPanel] = useState(true);

  const handleReportClick = () => {
    if (!user) { onAuthRequired(); return; }
    setShowReportForm(true);
  };

  const systemReports = selectedSystem ? getReportsBySystem(selectedSystem.id) : [];

  return (
    <div className="fixed inset-0" style={{ paddingTop: '72px', background: '#030912' }}>
      {/* Full screen map */}
      <div className="absolute inset-0" style={{ top: '72px' }}>
        <StarMap3D />
      </div>

      {/* Left Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-72 flex flex-col z-10" style={{ paddingTop: 0 }}>
        {/* Panel tabs */}
        <div className="flex glass border-r border-b" style={{ borderColor: '#0d2535' }}>
          {[
            { id: 'info', label: 'INTEL', icon: Info },
            { id: 'stats', label: 'STATS', icon: Radio },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setLeftPanel(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-orbitron tracking-widest transition-all"
              style={{
                color: leftPanel === id ? '#00d4ff' : '#8fb8cc',
                borderBottom: leftPanel === id ? '2px solid #00d4ff' : '2px solid transparent',
                background: leftPanel === id ? 'rgba(0,212,255,0.05)' : 'transparent',
                letterSpacing: '0.1em',
                fontSize: '0.65rem',
              }}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 glass border-r overflow-hidden" style={{ borderColor: '#0d2535' }}>
          <AnimatePresence mode="wait">
            {leftPanel === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto"
              >
                {/* Controls */}
                <div className="p-3 border-b space-y-2" style={{ borderColor: '#0d2535' }}>
                  <button
                    onClick={handleReportClick}
                    className="w-full flex items-center justify-center gap-2 py-2.5 font-orbitron text-xs rounded transition-all"
                    style={{
                      border: '1px solid rgba(255,34,51,0.6)',
                      color: '#ff2233',
                      background: 'rgba(255,34,51,0.08)',
                      letterSpacing: '0.1em',
                      boxShadow: '0 0 15px rgba(255,34,51,0.1)',
                    }}
                  >
                    <AlertTriangle size={12} />
                    REPORT PIRATES
                  </button>

                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-orbitron rounded transition-all"
                    style={{
                      border: `1px solid ${showHeatmap ? 'rgba(255,119,0,0.6)' : '#0d2535'}`,
                      color: showHeatmap ? '#ff7700' : '#8fb8cc',
                      background: showHeatmap ? 'rgba(255,119,0,0.08)' : 'transparent',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {showHeatmap ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showHeatmap ? 'HIDE HEATMAP' : 'THREAT HEATMAP'}
                  </button>
                </div>

                {/* Selected system info */}
                {selectedSystem ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-orbitron text-sm font-bold" style={{ color: '#00d4ff', letterSpacing: '0.1em' }}>
                        {selectedSystem.name}
                      </div>
                      <button onClick={() => setSelectedSystem(null)} style={{ color: '#8fb8cc' }}>
                        <X size={14} />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: '#8fb8cc' }}>Type</span>
                        <span style={{ color: '#e2e8f0' }}>{selectedSystem.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#8fb8cc' }}>Status</span>
                        <span style={{ color: '#00d4ff' }}>{selectedSystem.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#8fb8cc' }}>Danger</span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((n) => {
                              const color = DANGER_COLORS[selectedSystem.dangerLevel];
                              return (
                                <div key={n} className="w-2.5 h-2.5 rounded-sm" style={{
                                  background: n <= selectedSystem.dangerLevel ? color : '#0d2535'
                                }} />
                              );
                            })}
                          </div>
                          <span style={{ color: DANGER_COLORS[selectedSystem.dangerLevel] || '#8fb8cc' }}>
                            {selectedSystem.dangerLevel}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs mt-3 leading-relaxed" style={{ color: '#8fb8cc', fontSize: '0.7rem' }}>
                      {selectedSystem.description}
                    </p>

                    {/* Jump points */}
                    {selectedSystem.jumpPoints?.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-orbitron tracking-widest mb-2" style={{ color: '#8fb8cc', letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                          JUMP POINTS
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedSystem.jumpPoints.map((jp) => {
                            const target = STAR_SYSTEMS.find((s) => s.id === jp);
                            return (
                              <button
                                key={jp}
                                onClick={() => setSelectedSystem(target)}
                                className="px-2 py-0.5 rounded text-xs transition-all"
                                style={{ border: '1px solid #0d2535', color: '#00d4ff', background: 'rgba(0,212,255,0.05)', fontSize: '0.65rem' }}
                              >
                                <ChevronRight size={9} className="inline" />
                                {target?.name || jp}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Planets */}
                    {selectedSystem.planets?.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-orbitron tracking-widest mb-2" style={{ color: '#8fb8cc', letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                          BODIES ({selectedSystem.planets.length})
                        </div>
                        <div className="space-y-1.5">
                          {selectedSystem.planets.map((planet) => (
                            <div key={planet.id} className="p-2 rounded border" style={{ borderColor: '#0d2535' }}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ background: planet.color }} />
                                <span className="text-xs font-orbitron" style={{ color: '#e2e8f0', fontSize: '0.65rem' }}>
                                  {planet.name}
                                </span>
                              </div>
                              {planet.stations && (
                                <div className="mt-1 ml-5 space-y-0.5">
                                  {planet.stations.map((s) => (
                                    <div key={s} className="text-xs" style={{ color: '#00d4ff', fontSize: '0.6rem' }}>
                                      ◆ {s}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Local reports */}
                    {systemReports.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-orbitron tracking-widest mb-2" style={{ color: '#ff2233', letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                          LOCAL INTEL ({systemReports.length})
                        </div>
                        <div className="space-y-1">
                          {systemReports.slice(0, 3).map((r) => (
                            <div key={r.id} className="p-2 rounded border text-xs" style={{ borderColor: '#0d2535', color: '#8fb8cc', fontSize: '0.65rem' }}>
                              <span style={{ color: '#ff2233' }}>T{r.threatLevel}</span> — {r.pirateCount} pirates at {r.location}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-center py-8">
                      <Globe size={32} className="mx-auto mb-3" style={{ color: '#0d2535' }} />
                      <div className="text-xs font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                        SELECT A SYSTEM
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#8fb8cc', opacity: 0.5, fontSize: '0.6rem' }}>
                        Click any star to inspect
                      </div>
                    </div>

                    {/* System list */}
                    <div className="mt-2 space-y-1">
                      {STAR_SYSTEMS.map((sys) => {
                        const color = DANGER_COLORS[sys.dangerLevel] || '#8fb8cc';
                        return (
                          <button
                            key={sys.id}
                            onClick={() => setSelectedSystem(sys)}
                            className="w-full flex items-center justify-between p-2 rounded border text-left transition-all hover:border-cyan-900"
                            style={{ borderColor: '#0d2535' }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: sys.starColor }} />
                              <span className="text-xs font-orbitron" style={{ color: '#e2e8f0', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                {sys.name}
                              </span>
                            </div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((n) => (
                                <div key={n} style={{ width: '5px', height: '5px', borderRadius: '1px', background: n <= sys.dangerLevel ? color : '#0d2535' }} />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <StatsPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right panel toggle */}
      <button
        onClick={() => setShowRightPanel(!showRightPanel)}
        className="absolute right-0 z-20 p-2 glass border-l border-t border-b rounded-l transition-all"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          borderColor: '#0d2535',
          color: '#8fb8cc',
          right: showRightPanel ? '320px' : '0',
        }}
      >
        <ChevronRight size={14} style={{ transform: showRightPanel ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
      </button>

      {/* Right Panel - Live Feed */}
      <AnimatePresence>
        {showRightPanel && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-80 glass border-l flex flex-col z-10"
            style={{ borderColor: '#0d2535' }}
          >
            <ReportFeed compact={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map controls bottom-center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass border rounded px-3 py-2 z-10"
        style={{ borderColor: '#0d2535', left: 'calc(50% + 144px - 160px)' }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>
          <span>SCROLL: ZOOM</span>
          <div className="w-0.5 h-3" style={{ background: '#0d2535' }} />
          <span>DRAG: ROTATE</span>
          <div className="w-0.5 h-3" style={{ background: '#0d2535' }} />
          <span>CLICK: SELECT</span>
        </div>
      </div>

      {/* Report form modal */}
      <AnimatePresence>
        {showReportForm && (
          <ReportForm
            onClose={() => setShowReportForm(false)}
            defaultSystem={selectedSystem?.id || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
