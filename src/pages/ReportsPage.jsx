import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, BarChart2 } from 'lucide-react';
import ReportFeed from '../components/Reports/ReportFeed';
import ReportForm from '../components/Reports/ReportForm';
import StatsPanel from '../components/Dashboard/StatsPanel';
import { useAuthStore } from '../store/authStore';

export default function ReportsPage({ onAuthRequired }) {
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState('feed'); // 'feed' | 'stats'

  const handleReport = () => {
    if (!user) { onAuthRequired(); return; }
    setShowForm(true);
  };

  return (
    <div className="flex flex-col" style={{ paddingTop: '72px', height: '100vh', background: '#030912' }}>
      {/* Page header */}
      <div className="glass border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: '#0d2535' }}>
        <div className="flex items-center gap-4">
          <div>
            <div className="font-orbitron text-sm font-bold tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
              PIRATE INTEL DATABASE
            </div>
            <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              NETWORK JURISDICTION SECURITY OPERATIONS SUPPORT SYSTEM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded border overflow-hidden" style={{ borderColor: '#0d2535' }}>
            {[
              { id: 'feed', label: 'FEED' },
              { id: 'stats', label: 'STATS' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className="px-4 py-1.5 text-xs font-orbitron tracking-widest transition-all"
                style={{
                  color: view === id ? '#00d4ff' : '#8fb8cc',
                  background: view === id ? 'rgba(0,212,255,0.1)' : 'transparent',
                  borderRight: id === 'feed' ? '1px solid #0d2535' : 'none',
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleReport}
            className="flex items-center gap-2 px-4 py-2 font-orbitron text-xs rounded transition-all"
            style={{
              border: '1px solid rgba(255,34,51,0.6)',
              color: '#ff2233',
              background: 'rgba(255,34,51,0.08)',
              letterSpacing: '0.1em',
              boxShadow: '0 0 15px rgba(255,34,51,0.1)',
            }}
          >
            <Plus size={12} />
            SUBMIT REPORT
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full max-w-3xl mx-auto"
            >
              <ReportFeed />
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full max-w-4xl mx-auto"
            >
              <StatsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <ReportForm onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
