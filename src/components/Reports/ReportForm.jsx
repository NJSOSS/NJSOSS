import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Send, MapPin, Users, Ship, Tag, FileText } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { useAuthStore } from '../../store/authStore';
import { STAR_SYSTEMS } from '../../data/starSystems';
import { SHIPS } from '../../data/ships';

const THREAT_COLORS = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };
const THREAT_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Extreme' };

export default function ReportForm({ onClose, defaultSystem = '' }) {
  const addReport = useReportStore((s) => s.addReport);
  const incrementReports = useAuthStore((s) => s.incrementReports);
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    system: defaultSystem || '',
    location: '',
    pirateCount: 1,
    shipTypes: [],
    orgTag: '',
    threatLevel: 3,
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => {
    setError('');
    setForm({ ...form, [field]: e.target.value });
  };

  const toggleShip = (shipId) => {
    setForm({
      ...form,
      shipTypes: form.shipTypes.includes(shipId)
        ? form.shipTypes.filter((s) => s !== shipId)
        : [...form.shipTypes, shipId],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.system) { setError('Please select a star system.'); return; }
    if (!form.location) { setError('Please enter a location detail.'); return; }
    if (!form.description || form.description.length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }

    addReport({
      system: form.system,
      location: form.location,
      pirateCount: parseInt(form.pirateCount) || 1,
      shipTypes: form.shipTypes,
      orgTag: form.orgTag || null,
      threatLevel: form.threatLevel,
      description: form.description,
    }, user);

    if (user) incrementReports();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-hud p-8 text-center max-w-sm mx-4"
          style={{ border: '1px solid #00ff88', boxShadow: '0 0 40px rgba(0,255,136,0.2)' }}
        >
          <div className="text-4xl mb-4">✓</div>
          <div className="font-orbitron text-sm tracking-widest" style={{ color: '#00ff88', letterSpacing: '0.15em' }}>
            REPORT TRANSMITTED
          </div>
          <div className="text-xs mt-2" style={{ color: '#8fb8cc' }}>
            Intel has been logged to the NJSOSS network.
          </div>
        </motion.div>
      </div>
    );
  }

  const threatColor = THREAT_COLORS[form.threatLevel];

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card-hud w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        style={{ border: '1px solid rgba(255,34,51,0.4)', boxShadow: '0 0 40px rgba(255,34,51,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0" style={{ borderColor: '#0d2535' }}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} style={{ color: '#ff2233' }} />
            <div>
              <div className="font-orbitron text-sm font-bold tracking-widest" style={{ color: '#ff2233', letterSpacing: '0.15em' }}>
                SUBMIT PIRATE REPORT
              </div>
              <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                NETWORK INTELLIGENCE SUBMISSION
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 transition-colors hover:text-white" style={{ color: '#8fb8cc' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-2 gap-4">
            {/* System */}
            <div>
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                <MapPin size={10} className="inline mr-1" /> STAR SYSTEM
              </label>
              <select
                value={form.system}
                onChange={update('system')}
                className="w-full py-2 px-3 text-xs rounded border outline-none"
                style={{ borderColor: '#0d2535', fontSize: '0.75rem' }}
                required
              >
                <option value="">Select System...</option>
                {STAR_SYSTEMS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (Danger {s.dangerLevel})</option>
                ))}
              </select>
            </div>

            {/* Pirate count */}
            <div>
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                <Users size={10} className="inline mr-1" /> PIRATE COUNT
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={form.pirateCount}
                onChange={update('pirateCount')}
                className="w-full py-2 px-3 text-xs rounded border bg-transparent outline-none"
                style={{ borderColor: '#0d2535', color: '#e2e8f0', fontSize: '0.75rem' }}
                required
              />
            </div>

            {/* Location detail - full width */}
            <div className="col-span-2">
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                LOCATION DETAIL
              </label>
              <input
                type="text"
                value={form.location}
                onChange={update('location')}
                placeholder="e.g. Grim HEX approach, 15km out / Bloom L4 / Delamar cave exit"
                className="w-full py-2 px-3 text-xs rounded border bg-transparent outline-none"
                style={{ borderColor: '#0d2535', color: '#e2e8f0', fontSize: '0.75rem' }}
                required
              />
            </div>

            {/* Ship types */}
            <div className="col-span-2">
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                <Ship size={10} className="inline mr-1" /> SHIP TYPES SPOTTED
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SHIPS.map((ship) => {
                  const selected = form.shipTypes.includes(ship.id);
                  const threatColors = { medium: '#ffdd00', high: '#ff7700', extreme: '#ff2233' };
                  const tc = threatColors[ship.threat] || '#8fb8cc';
                  return (
                    <button
                      key={ship.id}
                      type="button"
                      onClick={() => toggleShip(ship.id)}
                      className="py-1.5 px-2 text-left rounded border transition-all"
                      style={{
                        borderColor: selected ? tc : '#0d2535',
                        background: selected ? `${tc}15` : 'transparent',
                        color: selected ? tc : '#8fb8cc',
                        fontSize: '0.65rem',
                      }}
                    >
                      <div style={{ fontWeight: selected ? '600' : '400' }}>{ship.name}</div>
                      <div style={{ opacity: 0.6, fontSize: '0.55rem' }}>{ship.manufacturer.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Org tag */}
            <div>
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                <Tag size={10} className="inline mr-1" /> ORG TAG (OPTIONAL)
              </label>
              <input
                type="text"
                value={form.orgTag}
                onChange={update('orgTag')}
                placeholder="e.g. VOID, REAP, CRSH"
                className="w-full py-2 px-3 text-xs rounded border bg-transparent outline-none"
                style={{ borderColor: '#0d2535', color: '#e2e8f0', fontSize: '0.75rem' }}
                maxLength={10}
              />
            </div>

            {/* Threat level */}
            <div>
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                THREAT LEVEL
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.threatLevel}
                  onChange={(e) => setForm({ ...form, threatLevel: parseInt(e.target.value) })}
                  className="w-full"
                  style={{
                    accentColor: threatColor,
                  }}
                />
                <div className="text-center font-orbitron text-sm font-bold"
                  style={{ color: threatColor, letterSpacing: '0.1em' }}>
                  {form.threatLevel} — {THREAT_LABELS[form.threatLevel]}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-xs mb-2 font-orbitron tracking-widest" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
                <FileText size={10} className="inline mr-1" /> INTEL DESCRIPTION
              </label>
              <textarea
                value={form.description}
                onChange={update('description')}
                placeholder="Describe the pirate activity in detail. Include behavior, weapons, tactics, patrol routes, etc."
                rows={4}
                className="w-full py-2 px-3 text-xs rounded border bg-transparent outline-none resize-none"
                style={{ borderColor: '#0d2535', color: '#e2e8f0', fontSize: '0.75rem', lineHeight: '1.5' }}
                required
              />
              <div className="text-right text-xs mt-1" style={{ color: '#8fb8cc', opacity: 0.5, fontSize: '0.6rem' }}>
                {form.description.length} chars
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="col-span-2 flex items-center gap-2 p-3 rounded text-xs"
                style={{ background: 'rgba(255,34,51,0.1)', border: '1px solid rgba(255,34,51,0.3)', color: '#ff2233' }}>
                <AlertTriangle size={12} />
                {error}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="p-4 border-t flex gap-3 justify-end flex-shrink-0" style={{ borderColor: '#0d2535' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded border transition-all font-orbitron tracking-widest"
              style={{ borderColor: '#0d2535', color: '#8fb8cc', letterSpacing: '0.1em' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-xs rounded font-orbitron tracking-widest transition-all"
              style={{
                background: 'rgba(255,34,51,0.15)',
                border: '1px solid rgba(255,34,51,0.6)',
                color: '#ff2233',
                letterSpacing: '0.1em',
                boxShadow: '0 0 20px rgba(255,34,51,0.15)',
              }}
            >
              <Send size={12} />
              TRANSMIT REPORT
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
