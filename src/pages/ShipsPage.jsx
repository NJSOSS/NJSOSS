import React from 'react';
import { Rocket } from 'lucide-react';
import ShipViewer from '../components/Ships/ShipViewer';

export default function ShipsPage() {
  return (
    <div className="flex flex-col" style={{ paddingTop: '72px', height: '100vh', background: '#030912' }}>
      {/* Header */}
      <div className="glass border-b px-6 py-3 flex items-center gap-4" style={{ borderColor: '#0d2535' }}>
        <Rocket size={18} style={{ color: '#00d4ff' }} />
        <div>
          <div className="font-orbitron text-sm font-bold tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
            VESSEL RECOGNITION DATABASE
          </div>
          <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            COMMON PIRATE VESSELS — THREAT ASSESSMENT & IDENTIFICATION
          </div>
        </div>
      </div>

      {/* Ship viewer */}
      <div className="flex-1 overflow-hidden">
        <ShipViewer />
      </div>
    </div>
  );
}
