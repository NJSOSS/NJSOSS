import { useState } from 'react';
import { useReportStore } from '../store/reportStore';
import ReportCard from '../components/Reports/ReportCard';
import ReportForm from '../components/Reports/ReportForm';
import { STAR_SYSTEMS } from '../data/starSystems';
import { Filter, Plus, AlertTriangle, Search } from 'lucide-react';

const THREAT_LABELS = { 1: 'Low', 2: 'Guarded', 3: 'Elevated', 4: 'High', 5: 'Extreme' };

export default function ReportsPage() {
  const { reports } = useReportStore();
  const [showForm, setShowForm] = useState(false);
  const [filterSystem, setFilterSystem] = useState('all');
  const [filterThreat, setFilterThreat] = useState(0);
  const [filterVerified, setFilterVerified] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  let filtered = [...reports];
  if (filterSystem !== 'all') filtered = filtered.filter(r => r.system === filterSystem);
  if (filterThreat > 0) filtered = filtered.filter(r => r.threatLevel >= filterThreat);
  if (filterVerified) filtered = filtered.filter(r => r.verified);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.location?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.orgTag?.toLowerCase().includes(q) ||
      r.reportedBy?.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'newest') filtered.sort((a, b) => b.timestamp - a.timestamp);
  else if (sortBy === 'threat') filtered.sort((a, b) => b.threatLevel - a.threatLevel);
  else if (sortBy === 'upvotes') filtered.sort((a, b) => b.upvotes - a.upvotes);

  const selectStyle = {
    background: '#060f1a', border: '1px solid #0d2535', color: '#8fb8cc',
    padding: '6px 10px', fontSize: '11px', fontFamily: 'inherit',
    outline: 'none', borderRadius: '2px', cursor: 'pointer',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#030912' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px',
        borderBottom: '1px solid #0d2535', background: 'rgba(6,15,26,0.95)',
        backdropFilter: 'blur(8px)', flexWrap: 'wrap', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
          <AlertTriangle size={14} color="#ff2233" />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#00d4ff', letterSpacing: '0.1em' }}>
            INTEL FEED
          </span>
          <span style={{ fontSize: '10px', color: '#4a7a8c', marginLeft: '4px' }}>({filtered.length})</span>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#060f1a', border: '1px solid #0d2535', padding: '5px 10px', flex: '1', minWidth: '180px', maxWidth: '260px' }}>
          <Search size={11} color="#4a7a8c" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..." style={{ background: 'none', border: 'none', color: '#8fb8cc', fontSize: '11px', outline: 'none', width: '100%', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={11} color="#4a7a8c" />
          <select style={selectStyle} value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
            <option value="all">All Systems</option>
            {STAR_SYSTEMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select style={selectStyle} value={filterThreat} onChange={e => setFilterThreat(+e.target.value)}>
            <option value={0}>All Threats</option>
            {Object.entries(THREAT_LABELS).map(([k, v]) => <option key={k} value={k}>≥ {v}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#4a7a8c', cursor: 'pointer' }}>
            <input type="checkbox" checked={filterVerified} onChange={e => setFilterVerified(e.target.checked)} />
            Verified
          </label>
        </div>

        <select style={selectStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="threat">Threat Level</option>
          <option value="upvotes">Most Upvoted</option>
        </select>

        <button onClick={() => setShowForm(true)} style={{
          marginLeft: 'auto', background: 'rgba(255,34,51,0.1)', border: '1px solid #ff2233',
          color: '#ff2233', padding: '6px 14px', cursor: 'pointer',
          fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={11} /> REPORT
        </button>
      </div>

      {/* Report list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#4a7a8c', fontSize: '12px', padding: '60px' }}>
            <AlertTriangle size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', letterSpacing: '0.1em' }}>
              NO REPORTS MATCH FILTERS
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            {filtered.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        )}
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
