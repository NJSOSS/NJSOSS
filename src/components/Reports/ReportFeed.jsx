import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, RefreshCw, Radio } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { STAR_SYSTEMS } from '../../data/starSystems';
import ReportCard from './ReportCard';

export default function ReportFeed({ className = '', compact = false, limitSystem = null }) {
  const reports = useReportStore((s) => s.getFilteredReports());
  const filterSystem = useReportStore((s) => s.filterSystem);
  const filterThreat = useReportStore((s) => s.filterThreat);
  const setFilterSystem = useReportStore((s) => s.setFilterSystem);
  const setFilterThreat = useReportStore((s) => s.setFilterThreat);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const displayed = reports
    .filter((r) => {
      if (limitSystem && r.system !== limitSystem) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.location?.toLowerCase().includes(s) ||
        r.description?.toLowerCase().includes(s) ||
        r.reportedBy?.toLowerCase().includes(s) ||
        r.orgTag?.toLowerCase().includes(s) ||
        STAR_SYSTEMS.find((sys) => sys.id === r.system)?.name.toLowerCase().includes(s)
      );
    })
    .slice(0, compact ? 10 : 50);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Feed header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#0d2535' }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio size={14} style={{ color: '#00d4ff' }} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse" 
                 style={{ background: '#ff2233' }} />
          </div>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.1em' }}>
            LIVE INTEL FEED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>{displayed.length} reports</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 rounded transition-colors"
            style={{
              color: showFilters ? '#00d4ff' : '#8fb8cc',
              background: showFilters ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: '1px solid',
              borderColor: showFilters ? 'rgba(0,212,255,0.3)' : '#0d2535',
            }}
          >
            <Filter size={12} />
          </button>
        </div>
      </div>

      {/* Search & filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
            style={{ borderColor: '#0d2535' }}
          >
            <div className="p-3 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8fb8cc' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border bg-transparent outline-none"
                  style={{ borderColor: '#0d2535', color: '#e2e8f0', fontSize: '0.75rem' }}
                />
              </div>

              {/* System filter */}
              <select
                value={filterSystem || ''}
                onChange={(e) => setFilterSystem(e.target.value || null)}
                className="w-full py-1.5 px-2 text-xs rounded border outline-none"
                style={{ borderColor: '#0d2535', fontSize: '0.7rem' }}
              >
                <option value="">All Systems</option>
                {STAR_SYSTEMS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              {/* Threat filter */}
              <div className="flex gap-1">
                {[null, 1, 2, 3, 4, 5].map((t) => {
                  const colors = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };
                  return (
                    <button
                      key={t}
                      onClick={() => setFilterThreat(t)}
                      className="flex-1 py-1 text-xs rounded transition-all"
                      style={{
                        border: '1px solid',
                        borderColor: filterThreat === t ? (colors[t] || '#00d4ff') : '#0d2535',
                        color: filterThreat === t ? (colors[t] || '#00d4ff') : '#8fb8cc',
                        background: filterThreat === t ? `${colors[t] || '#00d4ff'}15` : 'transparent',
                        fontSize: '0.6rem',
                      }}
                    >
                      {t ? `T${t}+` : 'ALL'}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">📡</div>
              <div className="font-orbitron text-xs tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                NO REPORTS FOUND
              </div>
              <div className="text-xs mt-1" style={{ color: '#8fb8cc', opacity: 0.5 }}>
                Adjust filters or be the first to report
              </div>
            </div>
          ) : (
            displayed.map((report) => (
              <ReportCard key={report.id} report={report} compact={compact} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
