import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SHIPS, getThreatColor } from '../../data/ships';

// Ship 3D models built from Three.js geometries
function HornetModel({ color }) {
  return (
    <group>
      {/* Main fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2.5, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.2, 1]}>
        <sphereGeometry args={[0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#88ccff" metalness={0.2} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* Left wing */}
      <mesh position={[-1.2, 0, -0.2]} rotation={[0, 0.1, -0.15]}>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right wing */}
      <mesh position={[1.2, 0, -0.2]} rotation={[0, -0.1, 0.15]}>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Engine nozzle */}
      <mesh position={[0, 0, -1.3]}>
        <cylinderGeometry args={[0.35, 0.25, 0.4, 12]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.5} metalness={0.5} />
      </mesh>
      {/* Wing cannons */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x * 0.8, -0.1, 0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function CutlassModel({ color }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.4, 3]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Left swept wing */}
      <mesh position={[-1.5, 0, -0.5]} rotation={[0, 0.3, -0.2]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Right swept wing */}
      <mesh position={[1.5, 0, -0.5]} rotation={[0, -0.3, 0.2]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cargo pod */}
      <mesh position={[0, -0.4, -0.5]}>
        <boxGeometry args={[0.7, 0.5, 1.8]} />
        <meshStandardMaterial color="#553322" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.25, 1.1]}>
        <sphereGeometry args={[0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.65} roughness={0.1} />
      </mesh>
      {/* Dual engines */}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0, -1.7]}>
          <cylinderGeometry args={[0.22, 0.18, 0.5, 10]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function BuccaneerModel({ color }) {
  return (
    <group>
      {/* Slim fuselage */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.3, 2.2, 10]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Short aggressive wings */}
      <mesh position={[-0.9, 0, 0]} rotation={[0.1, 0.2, -0.3]}>
        <boxGeometry args={[1.4, 0.07, 0.7]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0.9, 0, 0]} rotation={[-0.1, -0.2, 0.3]}>
        <boxGeometry args={[1.4, 0.07, 0.7]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Nose cannons */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 6]} />
          <meshStandardMaterial color="#333333" metalness={0.9} />
        </mesh>
      ))}
      {/* Engine glow */}
      <mesh position={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.25, 0.18, 0.35, 10]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function ConstellationModel({ color }) {
  return (
    <group>
      {/* Long main body */}
      <mesh>
        <boxGeometry args={[0.9, 0.6, 4.5]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cockpit section */}
      <mesh position={[0, 0.2, 2.1]}>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color="#334466" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Left nacelle */}
      <mesh position={[-1.4, 0, -0.5]}>
        <cylinderGeometry args={[0.2, 0.25, 3.5, 10]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right nacelle */}
      <mesh position={[1.4, 0, -0.5]}>
        <cylinderGeometry args={[0.2, 0.25, 3.5, 10]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Connecting wings */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.7, 0, -0.3]}>
          <boxGeometry args={[0.9, 0.1, 1.5]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Engines */}
      {[-1.4, 0, 1.4].map((x) => (
        <mesh key={x} position={[x, 0, -2.5]}>
          <cylinderGeometry args={[x === 0 ? 0.28 : 0.2, x === 0 ? 0.22 : 0.15, 0.5, 10]} />
          <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CaterpillarModel({ color }) {
  return (
    <group>
      {/* Command module */}
      <mesh position={[0, 0.1, 3]}>
        <boxGeometry args={[1.2, 0.8, 1.5]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cargo modules */}
      {[-1.5, 0, 1.5].map((z, i) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[1.6, 1, 1.3]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : '#6a4428'} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Side rails */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, -0.2, 0.5]}>
          <boxGeometry args={[0.15, 0.15, 5.5]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Engines at rear */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0, -3]}>
          <cylinderGeometry args={[0.28, 0.2, 0.6, 10]} />
          <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Turrets */}
      {[[-0.8, 0.5, 2], [0.8, 0.5, 0], [-0.8, 0.5, -1.5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.25, 8]} />
            <meshStandardMaterial color="#445566" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.15, 0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#333333" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HammerheadModel({ color }) {
  return (
    <group>
      {/* Central spine */}
      <mesh>
        <boxGeometry args={[0.6, 0.6, 5]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* T-shaped bridge */}
      <mesh position={[0, 0, 2.2]}>
        <boxGeometry args={[3.5, 0.5, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Side booms */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.35, 0.35, 4.2]} />
          <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
        </mesh>
      ))}
      {/* 6 turrets */}
      {[[-1.5, 0.3, 1.5], [1.5, 0.3, 1.5], [-1.5, 0.3, -0.5], [1.5, 0.3, -0.5], [-1.5, -0.3, 0.5], [1.5, -0.3, 0.5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[0.4, 0.3, 0.5]} />
            <meshStandardMaterial color="#445566" metalness={0.8} roughness={0.2} />
          </mesh>
          {[-0.1, 0.1].map((dx) => (
            <mesh key={dx} position={[dx, 0, 0.35]}>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#222222" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Main engines */}
      {[-0.8, -0.3, 0.3, 0.8].map((x) => (
        <mesh key={x} position={[x, 0, -2.7]}>
          <cylinderGeometry args={[0.18, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function AvengerModel({ color }) {
  return (
    <group>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.7, 0.45, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.05, 1.3]}>
        <coneGeometry args={[0.3, 0.7, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Wings - distinctive Avenger style */}
      <mesh position={[-0.9, -0.1, -0.2]} rotation={[0.1, 0.05, -0.15]}>
        <boxGeometry args={[1.2, 0.08, 1]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0.9, -0.1, -0.2]} rotation={[-0.1, -0.05, 0.15]}>
        <boxGeometry args={[1.2, 0.08, 1]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Cargo pod under */}
      <mesh position={[0, -0.35, -0.3]}>
        <boxGeometry args={[0.4, 0.3, 1]} />
        <meshStandardMaterial color="#334455" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Engine */}
      <mesh position={[0, 0, -1.4]}>
        <cylinderGeometry args={[0.28, 0.2, 0.5, 10]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

const SHIP_MODELS = {
  hornet: HornetModel,
  cutlass_black: CutlassModel,
  buccaneer: BuccaneerModel,
  constellation: ConstellationModel,
  caterpillar: CaterpillarModel,
  hammerhead: HammerheadModel,
  avenger: AvengerModel,
};

function RotatingShip({ shipId, color, isSelected }) {
  const groupRef = useRef();
  const pedestalRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }
  });

  const Model = SHIP_MODELS[shipId] || HornetModel;

  return (
    <group>
      {/* Pedestal */}
      <mesh ref={pedestalRef} position={[0, -2, 0]}>
        <cylinderGeometry args={[1.5, 2, 0.2, 32]} />
        <meshStandardMaterial color="#060f1a" metalness={0.8} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, -1.92, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.05, 32]} />
        <meshBasicMaterial color={isSelected ? '#00d4ff' : '#0d2535'} transparent opacity={0.8} />
      </mesh>

      {/* Ship */}
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <Model color={color} />
      </group>

      {/* Scan ring */}
      <mesh position={[0, -1.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.6, 64]} />
        <meshBasicMaterial color={isSelected ? '#00d4ff' : '#0d2535'} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Point light for glow */}
      <pointLight position={[0, 1, 0]} intensity={1} color={color} distance={8} />
    </group>
  );
}

function ShipScene({ ship }) {
  return (
    <>
      <color attach="background" args={['#030912']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#00d4ff" />
      <RotatingShip shipId={ship?.id} color={ship?.color || '#ffffff'} isSelected={true} />
      <OrbitControls enablePan={false} maxDistance={12} minDistance={3} enableDamping dampingFactor={0.05} />
    </>
  );
}

const THREAT_COLORS = { low: '#00ff88', medium: '#ffdd00', high: '#ff7700', extreme: '#ff2233' };
const FREQ_COLORS = (f) => f >= 80 ? '#ff2233' : f >= 50 ? '#ff7700' : f >= 30 ? '#ffdd00' : '#8fb8cc';

export default function ShipViewer() {
  const [selectedShip, setSelectedShip] = useState(SHIPS[1]); // Default to Cutlass Black

  const threatColor = THREAT_COLORS[selectedShip?.threat] || '#8fb8cc';

  return (
    <div className="flex h-full" style={{ background: '#030912' }}>
      {/* Ship list sidebar */}
      <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#0d2535' }}>
        <div className="p-3 border-b" style={{ borderColor: '#0d2535' }}>
          <div className="font-orbitron text-xs tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
            VESSEL DATABASE
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>
            Common pirate vessels
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SHIPS.map((ship) => {
            const tc = THREAT_COLORS[ship.threat] || '#8fb8cc';
            const isSelected = selectedShip?.id === ship.id;
            return (
              <button
                key={ship.id}
                onClick={() => setSelectedShip(ship)}
                className="w-full text-left p-2.5 rounded border transition-all"
                style={{
                  borderColor: isSelected ? tc : '#0d2535',
                  background: isSelected ? `${tc}10` : 'transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-orbitron" style={{ color: isSelected ? tc : '#e2e8f0', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    {ship.name}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${tc}20`, color: tc, fontSize: '0.55rem', letterSpacing: '0.05em' }}>
                    {ship.threat.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.65rem' }}>
                  {ship.manufacturer}
                </div>
                <div className="mt-1.5">
                  <div className="text-xs mb-0.5" style={{ color: '#8fb8cc', fontSize: '0.55rem', letterSpacing: '0.05em' }}>
                    PIRATE FREQ
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: '#0d2535' }}>
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{ width: `${ship.pirateFrequency}%`, background: FREQ_COLORS(ship.pirateFrequency) }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ antialias: true }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <ShipScene ship={selectedShip} />
          </Suspense>
        </Canvas>

        {/* HUD overlay corners */}
        <div className="absolute top-4 left-4 pointer-events-none" style={{ color: '#00d4ff', opacity: 0.4 }}>
          <div style={{ width: '20px', height: '20px', borderTop: '2px solid', borderLeft: '2px solid', borderColor: '#00d4ff' }} />
        </div>
        <div className="absolute top-4 right-4 pointer-events-none" style={{ color: '#00d4ff', opacity: 0.4 }}>
          <div style={{ width: '20px', height: '20px', borderTop: '2px solid', borderRight: '2px solid', borderColor: '#00d4ff' }} />
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <div style={{ width: '20px', height: '20px', borderBottom: '2px solid', borderLeft: '2px solid', borderColor: '#00d4ff', opacity: 0.4 }} />
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div style={{ width: '20px', height: '20px', borderBottom: '2px solid', borderRight: '2px solid', borderColor: '#00d4ff', opacity: 0.4 }} />
        </div>

        {/* Ship name overlay */}
        {selectedShip && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <div className="font-orbitron text-sm font-bold tracking-widest" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
              {selectedShip.name}
            </div>
            <div className="text-xs" style={{ color: '#8fb8cc', letterSpacing: '0.1em' }}>
              {selectedShip.manufacturer}
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-xs" style={{ color: '#8fb8cc', opacity: 0.5, fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
        </div>
      </div>

      {/* Ship stats panel */}
      {selectedShip && (
        <div className="w-72 flex-shrink-0 border-l overflow-y-auto" style={{ borderColor: '#0d2535' }}>
          <div className="p-4 border-b" style={{ borderColor: '#0d2535', borderTop: `2px solid ${threatColor}` }}>
            <div className="font-orbitron text-sm font-bold" style={{ color: '#e2e8f0', letterSpacing: '0.05em' }}>
              {selectedShip.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#8fb8cc' }}>{selectedShip.manufacturer}</div>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: `${threatColor}20`, border: `1px solid ${threatColor}40` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: threatColor }} />
              <span className="font-orbitron text-xs" style={{ color: threatColor, letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                {selectedShip.threat.toUpperCase()} THREAT
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Description */}
            <div>
              <div className="text-xs mb-2" style={{ color: '#8fb8cc', lineHeight: '1.5', fontSize: '0.75rem' }}>
                {selectedShip.description}
              </div>
            </div>

            {/* Stats grid */}
            <div>
              <div className="font-orbitron text-xs tracking-widest mb-2" style={{ color: '#00d4ff', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                SPECIFICATIONS
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Role', value: selectedShip.role },
                  { label: 'Crew', value: selectedShip.crew },
                  { label: 'Cargo', value: `${selectedShip.cargo} SCU` },
                  { label: 'Length', value: `${selectedShip.length}m` },
                  { label: 'Top Speed', value: selectedShip.topSpeed || 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#0d2535' }}>
                    <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{label}</span>
                    <span className="text-xs font-orbitron" style={{ color: '#e2e8f0', fontSize: '0.7rem' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weapons */}
            {selectedShip.weapons && (
              <div>
                <div className="font-orbitron text-xs tracking-widest mb-2" style={{ color: '#ff7700', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                  ARMAMENT
                </div>
                <div className="space-y-1">
                  {selectedShip.weapons.map((w) => (
                    <div key={w} className="flex items-center gap-2 text-xs" style={{ color: '#8fb8cc', fontSize: '0.7rem' }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: '#ff7700', flexShrink: 0 }} />
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pirate frequency meter */}
            <div>
              <div className="font-orbitron text-xs tracking-widest mb-2" style={{ color: '#ff2233', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                PIRATE ENCOUNTER FREQUENCY
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#0d2535' }}>
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${selectedShip.pirateFrequency}%`,
                    background: `linear-gradient(90deg, #ff770060, ${FREQ_COLORS(selectedShip.pirateFrequency)})`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>Rare</span>
                <span className="text-xs font-orbitron" style={{ color: FREQ_COLORS(selectedShip.pirateFrequency), fontSize: '0.7rem' }}>
                  {selectedShip.pirateFrequency}%
                </span>
                <span className="text-xs" style={{ color: '#8fb8cc', fontSize: '0.6rem' }}>Common</span>
              </div>
            </div>

            {/* Warning for extreme threat */}
            {selectedShip.threat === 'extreme' && (
              <div className="p-3 rounded border text-xs" style={{ borderColor: 'rgba(255,34,51,0.4)', background: 'rgba(255,34,51,0.08)', color: '#ff2233', fontSize: '0.7rem', lineHeight: '1.5' }}>
                ⚠ EXTREME THREAT — Retreat immediately if encountered. Do not engage without superior firepower.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
