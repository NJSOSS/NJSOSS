import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { STAR_SYSTEMS } from '../../data/starSystems';
import { useReportStore } from '../../store/reportStore';

const THREAT_COLORS = { 1: '#00ff88', 2: '#aaff00', 3: '#ffdd00', 4: '#ff7700', 5: '#ff2233' };

// Pulsing ring around star systems with pirate activity
function ActivityRing({ position, intensity }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.2 * intensity);
    ref.current.material.opacity = 0.3 + Math.sin(t * 3) * 0.2;
  });
  const color = intensity > 0.7 ? '#ff2233' : intensity > 0.4 ? '#ff7700' : '#ffdd00';
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[2.5, 0.05, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Individual star system
function SystemNode({ system, onClick, isSelected, reportCount }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.5) * 0.04;
    meshRef.current.scale.setScalar(pulse);
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.05;
    }
  });

  const pos = system.position;

  return (
    <group position={pos}>
      {/* Core star */}
      <mesh ref={meshRef} onClick={() => onClick(system)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[system.size * 0.45, 32, 32]} />
        <meshStandardMaterial
          color={system.starColor}
          emissive={system.starColor}
          emissiveIntensity={hovered || isSelected ? 3 : 1.8}
        />
      </mesh>

      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[system.size * 1.1, 16, 16]} />
        <meshBasicMaterial
          color={system.starColor}
          transparent opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Activity ring if reports */}
      {reportCount > 0 && (
        <ActivityRing position={[0, 0, 0]} intensity={Math.min(reportCount / 8, 1)} />
      )}

      {/* Point light */}
      <pointLight color={system.starColor} intensity={2} distance={12} />

      {/* Label */}
      <Html distanceFactor={45} center>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          color: isSelected ? '#00d4ff' : hovered ? '#ffffff' : '#8fb8cc',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px rgba(0,0,0,0.9)',
          cursor: 'pointer',
          padding: '2px 6px',
          marginTop: '28px',
          background: isSelected ? 'rgba(0,212,255,0.1)' : 'transparent',
          border: isSelected ? '1px solid rgba(0,212,255,0.3)' : 'none',
          pointerEvents: 'none',
          letterSpacing: '0.05em',
        }}>
          {system.name}
          {reportCount > 0 && <span style={{ color: '#ff2233', marginLeft: '4px' }}>●</span>}
        </div>
      </Html>
    </group>
  );
}

// Jump point lines
function JumpLines({ systems }) {
  const lines = useMemo(() => {
    const drawn = new Set();
    const result = [];
    systems.forEach(sys => {
      (sys.jumpPoints || []).forEach(targetId => {
        const key = [sys.id, targetId].sort().join('-');
        if (drawn.has(key)) return;
        drawn.add(key);
        const target = systems.find(s => s.id === targetId);
        if (!target) return;
        result.push({ key, from: sys.position, to: target.position });
      });
    });
    return result;
  }, [systems]);

  return (
    <>
      {lines.map(({ key, from, to }) => (
        <Line key={key}
          points={[from, to]}
          color="#0d3d55"
          lineWidth={0.8}
          dashed dashSize={1} gapSize={1}
        />
      ))}
    </>
  );
}

// Pirate report markers
function PirateMarker({ report, system }) {
  const ref = useRef();
  const color = THREAT_COLORS[report.threatLevel] || '#ff2233';

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 5 + Math.random()) * 0.4);
    ref.current.material.opacity = 0.7 + Math.sin(t * 5) * 0.25;
  });

  const offset = [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 4,
  ];
  const pos = [
    system.position[0] + offset[0],
    system.position[1] + offset[1],
    system.position[2] + offset[2],
  ];

  return (
    <mesh ref={ref} position={pos}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={2}
        transparent opacity={0.8}
      />
    </mesh>
  );
}

// Heatmap overlay — additive blending spheres per system
function HeatmapLayer({ systems, reports }) {
  return (
    <>
      {systems.map(sys => {
        const count = reports.filter(r => r.system === sys.id).length;
        if (count === 0) return null;
        const intensity = Math.min(count / 8, 1);
        const color = intensity > 0.75 ? '#ff0000'
          : intensity > 0.5 ? '#ff4400'
          : intensity > 0.25 ? '#ff8800'
          : '#ffcc00';
        const radius = sys.size * 2.5 + intensity * 6;
        return (
          <mesh key={sys.id} position={sys.position}>
            <sphereGeometry args={[radius, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent opacity={0.12 + intensity * 0.22}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
}

// Inner system view
function InnerSystemView({ system, reports }) {
  return (
    <group>
      {/* Star */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color={system.starColor} emissive={system.starColor} emissiveIntensity={2.5} />
      </mesh>
      <pointLight color={system.starColor} intensity={8} distance={60} />

      {/* Orbit rings */}
      {(system.planets || []).map(planet => (
        <mesh key={planet.id + '-ring'} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[planet.orbitRadius, 0.03, 6, 128]} />
          <meshBasicMaterial color="#0d2535" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Planets */}
      {(system.planets || []).map((planet, i) => (
        <PlanetNode key={planet.id} planet={planet} index={i} />
      ))}

      {/* Report markers in system */}
      {reports.filter(r => r.system === system.id).map(r => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 3 + Math.random() * 8;
        return (
          <mesh key={r.id} position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#ff2233" emissive="#ff2233" emissiveIntensity={3} transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function PlanetNode({ planet, index }) {
  const groupRef = useRef();
  const speed = (0.05 + index * 0.02) * 0.5;

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += speed * 0.01;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[planet.orbitRadius, 0, 0]}>
        <sphereGeometry args={[planet.size * 0.8, 24, 24]} />
        <meshStandardMaterial color={planet.color} roughness={0.8} metalness={0.1} />
      </mesh>
      <Html position={[planet.orbitRadius, planet.size + 0.5, 0]} distanceFactor={30} center>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: '#4a7a8c',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          textShadow: '0 0 6px rgba(0,0,0,1)',
        }}>
          {planet.name}
        </div>
      </Html>
    </group>
  );
}

// Camera controller to zoom to selected system
function CameraController({ selectedSystem }) {
  const { controls } = { controls: null };
  return null;
}

export default function StarMap3D({ showHeatmap, onSystemSelect, selectedSystem }) {
  const { reports } = useReportStore();

  const reportsBySystem = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      map[r.system] = (map[r.system] || 0) + 1;
    });
    return map;
  }, [reports]);

  // Stable marker positions per report (avoid re-computing each frame)
  const markerData = useMemo(() => {
    return reports.slice(0, 50).map(r => {
      const sys = STAR_SYSTEMS.find(s => s.id === r.system);
      if (!sys) return null;
      return { report: r, system: sys };
    }).filter(Boolean);
  }, [reports]);

  return (
    <Canvas
      camera={{ position: [0, 50, 100], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#030912' }}
    >
      <color attach="background" args={['#030912']} />
      <ambientLight intensity={0.05} />

      <Stars radius={300} depth={80} count={8000} factor={4} saturation={0} fade speed={0.3} />

      <OrbitControls
        maxDistance={220}
        minDistance={4}
        enablePan
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
      />

      <Suspense fallback={null}>
        {!selectedSystem ? (
          <>
            <JumpLines systems={STAR_SYSTEMS} />
            {STAR_SYSTEMS.map(sys => (
              <SystemNode
                key={sys.id}
                system={sys}
                onClick={onSystemSelect}
                isSelected={false}
                reportCount={reportsBySystem[sys.id] || 0}
              />
            ))}
            {markerData.map(({ report, system }) => (
              <PirateMarker key={report.id} report={report} system={system} />
            ))}
            {showHeatmap && <HeatmapLayer systems={STAR_SYSTEMS} reports={reports} />}
          </>
        ) : (
          <InnerSystemView system={selectedSystem} reports={reports} />
        )}
      </Suspense>
    </Canvas>
  );
}
