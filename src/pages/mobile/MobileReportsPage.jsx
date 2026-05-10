import { useState } from 'react';
import { useReportStore } from '../../store/reportStore';
import ReportCard from '../../components/Reports/ReportCard';
import ReportForm from '../../components/Reports/ReportForm';
import { STAR_SYSTEMS } from '../../data/starSystems';
import { Filter, Plus, Search, X } from 'lucide-react';

export default function MobileReportsPage() {
  const { reports } = useReportStore();
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSystem, setFilterSystem] = useState('all');
  const [filterThreat, setFilterThreat] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  let filtered = [...reports];
  if (filterSystem !== 'all') filtered = filtered.filter(r => r.system === filterSystem);
  if (filterThreat > 0) filtered = filtered.filter(r => r.threatLevel >= filterThreat);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.location?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.reportedBy?.toLowerCase().includes(q)
    );
  }
  if (sortBy === 'newest') filtered.sort((a, b) => b.timestamp - a.timestamp);
  else if (sortBy === 'threat') filtered.sort((a, b) => b.threatLevel - a.threatLevel);
  else if (sortBy === 'upvotes') filtered.sort((a, b) => b.upvotes - a.upvotes);

  const sel = { background: '#060f1a', border: '1px solid #0d2535', color: '#8fb8cc', padding: '8px', fontSize: '12px', fontFamily: 'inherit', borderRadius: '2px', width: '100%' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#030912', overflowY: 'auto' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #0d2535', background: 'rgba(6,15,26,0.97)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: showFilter ? '10px' : 0 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', background: '#060f1a', border: '1px solid #0d2535', padding: '8px 10px', borderRadius: '2px' }}>
            <Search size={13} color="#4a7a8c" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search reports..." style={{ background: 'none', border: 'none', color: '#8fb8cc', fontSize: '12px', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
          </div>
          <button onClick={() => setShowFilter(f => !f)} style={{
            background: showFilter ? 'rgba(0,212,255,0.1)' : '#060f1a',
            border: `1px solid ${showFilter ? '#00d4ff' : '#0d2535'}`,
            color: showFilter ? '#00d4ff' : '#4a7a8c', padding: '8px 12px',
            cursor: 'pointer', borderRadius: '2px',
          }}>
            <Filter size={14} />
          </button>
          <button onClick={() => setShowForm(true)} style={{
            background: 'rgba(255,34,51,0.12)', border: '1px solid #ff2233',
            color: '#ff2233', padding: '8px 12px', cursor: 'pointer', borderRadius: '2px',
          }}>
            <Plus size={14} />
          </button>
        </div>

        {showFilter && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <select style={sel} value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
              <option value="all">All Systems</option>
              {STAR_SYSTEMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select style={{ ...sel, flex: 1 }} value={filterThreat} onChange={e => setFilterThreat(+e.target.value)}>
                <option value={0}>All Threats</option>
                <option value={3}>≥ Elevated</option>
                <option value={4}>≥ High</option>
                <option value={5}>Extreme Only</option>
              </select>
              <select style={{ ...sel, flex: 1 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="threat">By Threat</option>
                <option value="upvotes">Top Voted</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Count */}
      <div style={{ padding: '8px 12px', fontSize: '10px', color: '#4a7a8c', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
        {filtered.length} REPORTS
      </div>

      {/* Reports */}
      <div style={{ padding: '0 10px 10px' }}>
        {filtered.map(r => <ReportCard key={r.id} report={r} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#4a7a8c', fontSize: '11px' }}>
            NO REPORTS MATCH FILTERS
          </div>
        )}
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
