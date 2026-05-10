import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, AlertTriangle, Shield, TrendingUp, Users, Radio } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { STAR_SYSTEMS, getDangerColor } from '../../data/starSystems';

const DANGER_COLORS = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };

function StatCard({ icon: Icon, label, value, color, subtext }) {
  return (
    <div className="card-hud p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} style={{ color }} />
        <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div className="font-orbitron text-xl font-bold" style={{ color, letterSpacing: '0.05em' }}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs mt-0.5" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>{subtext}</div>
      )}
    </div>
  );
}

export default function StatsPanel() {
  const stats = useReportStore((s) => s.getStats());
  const topSystems = useReportStore((s) => s.getTopDangerousSystems());
  const leaderboard = useReportStore((s) => s.getLeaderboard());
  const reports = useReportStore((s) => s.reports);

  const recentReports = reports.slice(0, 5);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 size={16} style={{ color: '#00d4ff' }} />
        <span className="font-orbitron text-xs tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
          NETWORK OVERVIEW
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={AlertTriangle}
          label="TOTAL REPORTS"
          value={stats.totalReports}
          color="#ff7700"
          subtext="All time"
        />
        <StatCard
          icon={Shield}
          label="VERIFIED"
          value={stats.verifiedReports}
          color="#00d4ff"
          subtext="Confirmed"
        />
        <StatCard
          icon={Users}
          label="ACTIVE PIRATES"
          value={stats.activePirates}
          color="#ff2233"
          subtext="Last 24h"
        />
      </div>

      {/* Top dangerous systems */}
      <div className="card-hud">
        <div className="p-3 border-b" style={{ borderColor: '#0d2535' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={12} style={{ color: '#ff2233' }} />
            <span className="font-orbitron text-xs tracking-widest" style={{ color: '#ff2233', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
              MOST DANGEROUS SYSTEMS
            </span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          {topSystems.length === 0 ? (
            <div className="p-3 text-center text-xs" style={{ color: '#8fb8cc' }}>No data</div>
          ) : (
            topSystems.map(({ system, count, avgThreat }, i) => {
              const sysData = STAR_SYSTEMS.find((s) => s.id === system);
              const threatLevel = Math.round(avgThreat);
              const color = DANGER_COLORS[threatLevel] || '#8fb8cc';
              const pct = Math.min((count / (topSystems[0]?.count || 1)) * 100, 100);
              return (
                <div key={system} className="p-2 rounded" style={{ background: i === 0 ? 'rgba(255,34,51,0.05)' : 'transparent' }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron text-xs" style={{ color: i === 0 ? '#ff2233' : '#8fb8cc', fontSize: '0.6rem' }}>
                        #{i + 1}
                      </span>
                      <span className="font-orbitron text-xs" style={{ color: '#e2e8f0', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        {sysData?.name || system}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>{count} reports</span>
                    </div>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: '#0d2535' }}>
                    <motion.div
                      className="h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent reports summary */}
      <div className="card-hud">
        <div className="p-3 border-b" style={{ borderColor: '#0d2535' }}>
          <div className="flex items-center gap-2">
            <Radio size={12} style={{ color: '#00d4ff' }} />
            <span className="font-orbitron text-xs tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
              RECENT ACTIVITY
            </span>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: '#0d2535' }}>
          {recentReports.map((report) => {
            const sysData = STAR_SYSTEMS.find((s) => s.id === report.system);
            const tc = DANGER_COLORS[report.threatLevel] || '#8fb8cc';
            const timeAgo = () => {
              const diff = Date.now() - report.timestamp;
              const mins = Math.floor(diff / 60000);
              if (mins < 60) return `${mins}m`;
              return `${Math.floor(diff / 3600000)}h`;
            };
            return (
              <div key={report.id} className="p-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: tc }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{ color: '#e2e8f0', fontSize: '0.7rem' }}>
                    {sysData?.name} — {report.location}
                  </div>
                  <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>
                    {report.pirateCount} pirates • T{report.threatLevel}
                  </div>
                </div>
                <div className="text-xs flex-shrink-0" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>
                  {timeAgo()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card-hud">
        <div className="p-3 border-b" style={{ borderColor: '#0d2535' }}>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#00ff88', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
            TOP REPORTERS
          </span>
        </div>
        <div className="p-2 space-y-1">
          {leaderboard.slice(0, 8).map(({ name, count, upvotes }, i) => {
            const rankColors = ['#ffdd00', '#aaaaaa', '#cc8855'];
            return (
              <div key={name} className="flex items-center gap-2 py-1">
                <span className="font-orbitron text-xs w-4" style={{ color: rankColors[i] || '#8fb8cc', fontSize: '0.6rem' }}>
                  {i + 1}
                </span>
                <span className="flex-1 text-xs" style={{ color: '#e2e8f0', fontSize: '0.7rem' }}>{name}</span>
                <span className="text-xs" style={{ color: '#00d4ff', fontSize: '0.65rem' }}>{count} rpts</span>
                <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>▲{upvotes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* System danger status */}
      <div className="card-hud">
        <div className="p-3 border-b" style={{ borderColor: '#0d2535' }}>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
            SYSTEM STATUS BOARD
          </span>
        </div>
        <div className="p-2 space-y-1">
          {STAR_SYSTEMS.map((sys) => {
            const color = DANGER_COLORS[sys.dangerLevel] || '#8fb8cc';
            return (
              <div key={sys.id} className="flex items-center justify-between py-1 border-b" style={{ borderColor: '#0d253510' }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-orbitron" style={{ color: '#e2e8f0', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    {sys.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>{sys.status}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => (
                      <div key={n} className="w-2 h-2 rounded-sm" style={{ 
                        background: n <= sys.dangerLevel ? color : '#0d2535'
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
