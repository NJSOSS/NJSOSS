import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function OrbitingPlanet({ planet, systemPosition, timeOffset }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const orbitSpeed = useMemo(() => 0.15 / Math.sqrt(planet.orbitRadius), [planet.orbitRadius]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitSpeed + timeOffset;
    if (groupRef.current) {
      groupRef.current.position.set(
        systemPosition[0] + Math.cos(t) * planet.orbitRadius,
        systemPosition[1],
        systemPosition[2] + Math.sin(t) * planet.orbitRadius
      );
    }
  });

  return (
    <>
      {/* Orbit ring */}
      <mesh position={systemPosition} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 64]} />
        <meshBasicMaterial color="#0d2535" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet */}
      <group ref={groupRef}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[planet.size, 16, 16]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={0.8}
            metalness={0.1}
            emissive={planet.color}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Stations as small cubes */}
        {planet.stations?.map((station, i) => {
          const angle = (i / planet.stations.length) * Math.PI * 2;
          const dist = planet.size * 1.5;
          return (
            <group key={station} position={[Math.cos(angle) * dist, dist * 0.5, Math.sin(angle) * dist]}>
              <mesh>
                <octahedronGeometry args={[0.1]} />
                <meshBasicMaterial color="#00d4ff" />
              </mesh>
              <Html distanceFactor={15} center style={{ pointerEvents: 'none' }}>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '7px',
                  color: '#00d4ff',
                  background: 'rgba(3,9,18,0.8)',
                  padding: '1px 4px',
                  whiteSpace: 'nowrap',
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '2px',
                }}>
                  {station}
                </div>
              </Html>
            </group>
          );
        })}

        <Html distanceFactor={20} center style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '7px',
            color: '#8fb8cc',
            background: 'rgba(3,9,18,0.7)',
            padding: '1px 4px',
            whiteSpace: 'nowrap',
            transform: 'translateY(-14px)',
          }}>
            {planet.name}
          </div>
        </Html>
      </group>
    </>
  );
}

export default function InnerSystemView({ system, reports }) {
  if (!system || !system.planets) return null;

  return (
    <>
      {system.planets.map((planet, i) => (
        <OrbitingPlanet
          key={planet.id}
          planet={planet}
          systemPosition={system.position}
          timeOffset={i * (Math.PI * 2 / system.planets.length)}
        />
      ))}

      {/* Pirate report markers for this system */}
      {reports.map((report, i) => {
        const angle = (i / Math.max(reports.length, 1)) * Math.PI * 2;
        const dist = 5 + (i % 3) * 3;
        const pos = [
          system.position[0] + Math.cos(angle) * dist,
          system.position[1] + 1,
          system.position[2] + Math.sin(angle) * dist,
        ];
        return (
          <PulsingReportMarker key={report.id} position={pos} report={report} />
        );
      })}
    </>
  );
}

function PulsingReportMarker({ position, report }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.7 + Math.sin(t * 4) * 0.3);
    }
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.6;
      ringRef.current.scale.setScalar(s);
      ringRef.current.material.opacity = Math.max(0, 0.5 - (s - 1) * 0.6);
    }
  });

  const color = report.threatLevel >= 4 ? '#ff2233' : report.threatLevel >= 3 ? '#ff7700' : '#ffdd00';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.25, 0.4, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={20} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(3,9,18,0.9)',
          border: `1px solid ${color}`,
          borderRadius: '2px',
          padding: '2px 5px',
          transform: 'translateY(-18px)',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: '7px', color }}>
            T{report.threatLevel} • {report.pirateCount} pirates
          </div>
        </div>
      </Html>
    </group>
  );
}
