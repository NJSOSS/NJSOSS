import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Shield, Clock, MapPin, AlertTriangle, Users, Crosshair } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { useAuthStore } from '../../store/authStore';
import { STAR_SYSTEMS } from '../../data/starSystems';
import { SHIPS } from '../../data/ships';

const THREAT_LABELS = { 1: 'MINIMAL', 2: 'LOW', 3: 'MODERATE', 4: 'HIGH', 5: 'EXTREME' };
const THREAT_COLORS = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function ReportCard({ report, compact = false }) {
  const upvoteReport = useReportStore((s) => s.upvoteReport);
  const verifyReport = useReportStore((s) => s.verifyReport);
  const user = useAuthStore((s) => s.user);
  const [justUpvoted, setJustUpvoted] = useState(false);

  const system = STAR_SYSTEMS.find((s) => s.id === report.system);
  const threatColor = THREAT_COLORS[report.threatLevel] || '#8fb8cc';
  const hasUpvoted = report.upvotedBy?.includes(user?.id);

  const handleUpvote = () => {
    if (!user) return;
    if (hasUpvoted) return;
    upvoteReport(report.id, user.id);
    setJustUpvoted(true);
    setTimeout(() => setJustUpvoted(false), 1000);
  };

  const handleVerify = () => {
    if (!user) return;
    if (report.verifiedBy?.includes(user.username)) return;
    verifyReport(report.id, user.username);
  };

  const reportedShips = (report.shipTypes || [])
    .map((id) => SHIPS.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card-hud overflow-hidden"
      style={{
        borderColor: report.verified ? 'rgba(0,212,255,0.3)' : '#0d2535',
        boxShadow: report.threatLevel >= 5 
          ? '0 0 15px rgba(255,34,51,0.1)' 
          : report.verified ? '0 0 10px rgba(0,212,255,0.05)' : 'none',
      }}
    >
      {/* Threat bar */}
      <div className="h-0.5 w-full" style={{ background: threatColor, opacity: 0.8 }} />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Threat badge */}
            <div
              className="px-2 py-0.5 rounded text-xs font-orbitron font-bold tracking-widest"
              style={{
                background: `${threatColor}20`,
                color: threatColor,
                border: `1px solid ${threatColor}40`,
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
              }}
            >
              T{report.threatLevel} {THREAT_LABELS[report.threatLevel]}
            </div>

            {/* Verified badge */}
            {report.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', fontSize: '0.6rem' }}>
                <Shield size={9} />
                VERIFIED
              </div>
            )}

            {/* Org tag */}
            {report.orgTag && (
              <div className="px-2 py-0.5 rounded text-xs"
                style={{ background: 'rgba(255,119,0,0.1)', color: '#ff7700', border: '1px solid rgba(255,119,0,0.3)', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                [{report.orgTag}]
              </div>
            )}
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>
            <Clock size={10} />
            {timeAgo(report.timestamp)}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1 mb-2">
          <MapPin size={11} className="mt-0.5 flex-shrink-0" style={{ color: '#00d4ff' }} />
          <div>
            <div className="text-xs font-orbitron" style={{ color: '#e2e8f0', letterSpacing: '0.05em' }}>
              {system?.name || report.system}
            </div>
            <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.7rem' }}>
              {report.location}
            </div>
          </div>
        </div>

        {/* Pirate count + ships */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Users size={11} style={{ color: '#ff2233' }} />
            <span className="text-xs font-orbitron" style={{ color: '#ff2233', letterSpacing: '0.05em' }}>
              {report.pirateCount} PIRATES
            </span>
          </div>
          {reportedShips.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Crosshair size={11} style={{ color: '#ff7700' }} />
              <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.7rem' }}>
                {reportedShips.map((s) => s.name).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs mb-3 leading-relaxed" style={{ color: '#8fb8cc', fontSize: '0.75rem' }}>
            {report.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>
            <span style={{ color: '#00d4ff' }}>{report.reportedBy}</span>
            {report.verifiedBy?.length > 0 && (
              <span style={{ color: '#8fb8cc' }}> • {report.verifiedBy.length} confirmations</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Verify button */}
            {user && !report.verifiedBy?.includes(user.username) && (
              <button
                onClick={handleVerify}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                style={{
                  border: '1px solid rgba(0,212,255,0.3)',
                  color: '#00d4ff',
                  background: 'transparent',
                  fontSize: '0.6rem',
                  letterSpacing: '0.05em',
                }}
              >
                <Shield size={9} />
                Confirm
              </button>
            )}

            {/* Upvote */}
            <button
              onClick={handleUpvote}
              disabled={!user || hasUpvoted}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{
                border: `1px solid ${hasUpvoted || justUpvoted ? 'rgba(0,212,255,0.5)' : 'rgba(13,37,53,0.8)'}`,
                color: hasUpvoted || justUpvoted ? '#00d4ff' : '#8fb8cc',
                background: hasUpvoted || justUpvoted ? 'rgba(0,212,255,0.1)' : 'transparent',
                cursor: user && !hasUpvoted ? 'pointer' : 'default',
                fontSize: '0.65rem',
              }}
            >
              <ThumbsUp size={10} />
              {report.upvotes}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
